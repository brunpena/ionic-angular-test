import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { EventModel } from '../../../shared/models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {

  private storageKey = 'feirapp_subscriptions';

  private events: EventModel[] = [
    {
      id: '1',
      titulo: 'Feira Tech',
      descricao: 'Encontro de tecnologia com palestras e networking.',
      imagemUrl: '',
      dataInicio: '2026-02-10T18:00:00',
      dataFim: '2026-02-10T22:00:00',
      local: 'Centro de Convenções',
      cidade: 'São Paulo',
      categoria: 'Tecnologia',
      lotacaoMax: 200,
      inscritosCount: 42
    },
    {
      id: '2',
      titulo: 'Expo Agro',
      descricao: 'Feira agroindustrial com expositores e demonstrações.',
      imagemUrl: '',
      dataInicio: '2026-03-05T09:00:00',
      dataFim: '2026-03-06T18:00:00',
      local: 'Parque Expo',
      cidade: 'Campinas',
      categoria: 'Agronegócio',
      lotacaoMax: 500,
      inscritosCount: 480
    },
    {
      id: '3',
      titulo: 'Startup Summit',
      descricao: 'Evento para startups, investidores e comunidades.',
      imagemUrl: '',
      dataInicio: '2026-09-01T10:00:00',
      dataFim: '2026-09-02T19:00:00',
      local: 'Teatro Municipal',
      cidade: 'Florianópolis',
      categoria: 'Empreendedorismo',
      lotacaoMax: 300,
      inscritosCount: 75
    }
  ];

  constructor(private storage: StorageService) {}

  list(): Observable<EventModel[]> {
    return of(this.events.slice());
  }

  getById(id: string): Observable<EventModel | undefined> {
    return of(this.events.find(e => e.id === id));
  }

  isFull(event: EventModel) {
    return event.inscritosCount >= event.lotacaoMax;
  }

  isPast(event: EventModel) {
    return new Date(event.dataInicio).getTime() < Date.now();
  }

  // Subscriptions persisted per-client (mock)
  getSubscriptions(): string[] {
    return this.storage.getItem<string[]>(this.storageKey) || [];
  }

  isSubscribed(id: string) {
    return this.getSubscriptions().includes(id);
  }

  subscribe(id: string): Observable<boolean> {
    const ev = this.events.find(e => e.id === id);
    if (!ev) return of(false);
    if (this.isFull(ev)) return of(false);

    // persist subscription
    const subs = new Set(this.getSubscriptions());
    if (!subs.has(id)) {
      subs.add(id);
      ev.inscritosCount = Math.min(ev.lotacaoMax, ev.inscritosCount + 1);
      this.storage.setItem(this.storageKey, Array.from(subs));
    }

    return of(true);
  }

  unsubscribe(id: string): Observable<boolean> {
    const ev = this.events.find(e => e.id === id);
    if (!ev) return of(false);

    const subs = new Set(this.getSubscriptions());
    if (subs.has(id)) {
      subs.delete(id);
      ev.inscritosCount = Math.max(0, ev.inscritosCount - 1);
      this.storage.setItem(this.storageKey, Array.from(subs));
    }

    return of(true);
  }
}
