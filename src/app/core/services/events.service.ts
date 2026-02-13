import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, shareReplay, map, tap, BehaviorSubject } from 'rxjs';
import { EventModel } from 'src/app/shared/models/event.model';
import { ApiEvent, mapApiToEvent } from 'src/app/features/events/mappers/event.mapper';

export interface CreateEventDto {
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  location: string;
  city: string;
  category: string;
  maxCapacity: number;
}

@Injectable({ providedIn: 'root' })
export class EventsService extends ApiService {

  private eventsCache$?: Observable<{ data: EventModel[]; total: number; page: number; limit: number }>;
  private eventByIdCache = new Map<string, BehaviorSubject<EventModel>>();


  // Lista de eventos com cache
  list() {
    if (!this.eventsCache$) {
      this.eventsCache$ = this.get<{ data: ApiEvent[]; total: number; page: number; limit: number }>('/events').pipe(
        map(response => ({
          ...response,
          data: response.data.map(mapApiToEvent)
        })),
        shareReplay(1)
      );
    }
    return this.eventsCache$;
  }

  // Limpa cache
  clearCache() {
    this.eventsCache$ = undefined;
    this.eventByIdCache.clear();
  }

  // Detalhes de um evento por ID com cache
  getById(id: string): Observable<EventModel> {
    if (!this.eventByIdCache.has(id)) {

      const subject = new BehaviorSubject<EventModel>(null as any);

      this.get<ApiEvent>(`/events/${id}`)
        .pipe(map(mapApiToEvent))
        .subscribe(event => subject.next(event));

      this.eventByIdCache.set(id, subject);
    }

    return this.eventByIdCache.get(id)!.asObservable();
  }

  // Inscrição
  subscribe(id: string) {
    return this.post(`/events/${id}/subscribe`).pipe(
      tap(() => {
        const subject = this.eventByIdCache.get(id);

        if (subject) {
          const current = subject.value;

          subject.next({
            ...current,
            isSubscribed: true,
            subscribersCount: (current.subscribersCount ?? 0) + 1
          });
        }
      })
    );
  }


  // Cancelar inscrição
  unsubscribe(id: string) {
    return this.delete(`/events/${id}/subscribe`).pipe(
      tap(() => {
        const subject = this.eventByIdCache.get(id);

        if (subject) {
          const current = subject.value;

          subject.next({
            ...current,
            isSubscribed: false,
            subscribersCount: Math.max(
              0,
              (current.subscribersCount ?? 0) - 1
            )
          });
        }
      })
    );
  }


  // Upload de imagem
  image(id: string, file: FormData) {
    return this.post(`/events/${id}/image`, file).pipe(
      tap(() => this.eventByIdCache.delete(id))
    );
  }

  // Criar evento
  create(dto: CreateEventDto) {
    return this.post('/events', dto).pipe(
      tap(() => this.clearCache()) // limpa todos caches
    );
  }

  // Atualizar evento
  update(id: string, dto: CreateEventDto) {
    return this.put(`/events/${id}`, dto).pipe(
      tap(() => this.eventByIdCache.delete(id))
    );
  }
}
