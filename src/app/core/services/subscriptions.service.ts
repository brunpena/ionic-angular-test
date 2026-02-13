import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject, shareReplay, tap, map } from 'rxjs';
import { EventModel } from 'src/app/shared/models/event.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService extends ApiService {

  private cache$?: Observable<EventModel[]>; 
  private cacheById = new Map<string, BehaviorSubject<EventModel>>();

  // Inscrições atuais
  mySubscriptions(): Observable<EventModel[]> {
    if (!this.cache$) {
      this.cache$ = this.get<EventModel[]>('/subscriptions/me').pipe(
        tap(data => {
          data.forEach(item => this.cacheById.set(item.id, new BehaviorSubject(item)));
        }),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  // 🔹 Novo método: inscrições passadas
  pastSubscriptions(): Observable<EventModel[]> {
    return this.get<EventModel[]>('/subscriptions/past').pipe(
      tap(data => data.forEach(item => this.cacheById.set(item.id, new BehaviorSubject(item)))),
      shareReplay(1)
    );
  }

  getById(id: string) {
    if (!this.cacheById.has(id)) {
      const subject = new BehaviorSubject<EventModel>(null as any);
      this.get<EventModel>(`/subscriptions/${id}`).subscribe(res => subject.next(res));
      this.cacheById.set(id, subject);
    }
    return this.cacheById.get(id)!.asObservable();
  }

  cancel(id: string) {
    return this.patch(`/subscriptions/${id}/cancel`).pipe(
      tap(() => {
        const subject = this.cacheById.get(id);
        if (subject) {
          const current = subject.value;
          subject.next({ ...current, cancelledAt: new Date().toISOString() });
        }
        this.clearCache();
      })
    );
  }

  clearCache() {
    this.cache$ = undefined;
    this.cacheById.clear();
  }
}
