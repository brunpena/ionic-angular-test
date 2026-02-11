import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonButton, IonImg } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';

import { EventsService } from 'src/app/core/services/events.service';
import { EventModel } from 'src/app/shared/models/event.model';

@Component({
  standalone: true,
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  imports: [
    CommonModule,
    DatePipe,
    IonContent,
    IonButton,
    IonImg
  ]
})
export class EventDetailPage implements OnInit {

  event?: EventModel;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsSvc: EventsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigateByUrl('/home');
      return;
    }

    this.loadEvent(id);
  }

  // ======================
  // LOAD + MAP
  // ======================
  private loadEvent(id: string) {
    this.loading = true;

    this.eventsSvc.getById(id).subscribe({
      next: apiEvent => {
        console.log('[EventDetail] API event:', apiEvent);

        // 🔁 MAP Event → EventModel
        this.event = {
          id: apiEvent.id,
          titulo: apiEvent.nome,
          descricao: apiEvent.descricao,
          imagemUrl: apiEvent.imagem,

          dataInicio: apiEvent.data,
          dataFim: undefined,

          local: apiEvent.local,
          cidade: '',

          lotacaoMax: 999, // backend não fornece
          inscritosCount: apiEvent.inscritos,

          isSubscribed: false
        };

        this.loading = false;
      },
      error: err => {
        console.error('[EventDetail] erro ao carregar evento', err);
        this.loading = false;
      }
    });
  }

  // ======================
  // NAV
  // ======================
  back() {
    this.router.navigateByUrl('/home');
  }

  // ======================
  // SUBSCRIBE
  // ======================
  subscribe() {
    if (!this.event || this.loading) return;

    this.loading = true;

    this.eventsSvc.subscribe(this.event.id).subscribe({
      next: () => {
        this.event!.inscritosCount++;
        this.event!.isSubscribed = true;
        this.loading = false;
      },
      error: err => {
        console.error('[EventDetail] erro subscribe', err);
        this.loading = false;
      }
    });
  }

  unsubscribe() {
    if (!this.event || this.loading) return;

    this.loading = true;

    this.eventsSvc.unsubscribe(this.event.id).subscribe({
      next: () => {
        this.event!.inscritosCount =
          Math.max(0, this.event!.inscritosCount - 1);
        this.event!.isSubscribed = false;
        this.loading = false;
      },
      error: err => {
        console.error('[EventDetail] erro unsubscribe', err);
        this.loading = false;
      }
    });
  }

  // ======================
  // GETTERS
  // ======================
  get isPast(): boolean {
    return !!this.event &&
      new Date(this.event.dataInicio).getTime() < Date.now();
  }

  get isFull(): boolean {
    return !!this.event && this.event.inscritosCount >= this.event.lotacaoMax;
  }

  get subscribed(): boolean {
    return !!this.event?.isSubscribed;
  }
}
