import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs';

import { EventModel } from 'src/app/shared/models/event.model';
import {
  ApiEvent,
  mapApiToEvent
} from 'src/app/features/events/mappers/event.mapper';

/**
 * DTO para criação/edição de evento
 */
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

/**
 * Filtros para listagem, busca e paginação
 */
export interface EventFilters {
  city?: string;
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class EventsService extends ApiService {

  clearCache() {
    this.cachedEvents = null;
  }


  private cachedEvents: EventModel[] | null = null;

  /**
   * Lista eventos com filtros, busca e paginação
   */
  list(filters: EventFilters = {}) {
  const queryString = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const url = queryString ? `/events?${queryString}` : '/events';

  return this.get<{ data: ApiEvent[]; total: number; page: number; limit: number }>(url).pipe(
    map(res => ({
      ...res,
      data: res.data.map(mapApiToEvent) as EventModel[]
    }))
  );
}

  /**
   * Detalhe de um evento
   */
  getById(id: string) {
    return this.get<ApiEvent>(`/events/${id}`).pipe(
      map(mapApiToEvent)
    );
  }

  /**
   * Eventos do usuário logado (Meus Eventos)
   * Endpoint: /users/me/events
   */
  myEvents() {
    return this.get<ApiEvent[]>('/users/me/events').pipe(
      map(events => events.map(mapApiToEvent) as EventModel[])
    );
  }

  /**
   * Inscrever-se em um evento
   */
  subscribe(id: string) {
    return this.post(`/events/${id}/subscribe`);
  }

  /**
   * Cancelar inscrição
   */
  unsubscribe(id: string) {
    return this.delete(`/events/${id}/subscribe`);
  }

  /**
   * Upload de imagem do evento
   */
  image(id: string, file: FormData) {
    return this.post(`/events/${id}/image`, file);
  }

  /**
   * Criar evento
   */
  create(dto: CreateEventDto) {
    return this.post('/events', dto);
  }

  /**
   * Atualizar evento
   */
  update(id: string, dto: CreateEventDto) {
    return this.put(`/events/${id}`, dto);
  }
}
