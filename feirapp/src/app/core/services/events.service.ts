import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

interface Event {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  local: string;
  imagem: string;
  inscritos: number;
}

@Injectable({ providedIn: 'root' })
export class EventsService extends ApiService {

  list() {
    return this.get<Event[]>('/events');
  }

  getById(id: string) {
    return this.get<Event>(`/events/${id}`);
  }

  subscribe(id: string) {
    return this.post(`/events/${id}/subscribe`);
  }

  unsubscribe(id: string) {
    return this.delete(`/events/${id}/subscribe`);
  }

  image(id: string, file: FormData) {
    return this.post(`/events/${id}/image`, file);
  }
}
