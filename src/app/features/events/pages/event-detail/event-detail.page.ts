import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonButton, IonRefresher, IonRefresherContent} from '@ionic/angular/standalone';
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
    IonRefresher,
    IonRefresherContent
  ]
})
export class EventDetailPage implements OnInit {

  event?: EventModel;

  loading = false;                 // loading do fetch inicial
  loadingId: string | null = null; // loading do botão

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsSvc: EventsService
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    console.log('========== EVENT DETAIL INIT ==========');
    console.log('ID recebido da rota:', id);

    if (!id) {
      console.warn('ID não encontrado na rota. Redirecionando...');
      this.router.navigateByUrl('/home');
      return;
    }

    this.loadEvent(id);
  }

  // =========================
  // LOAD EVENT
  // =========================

  private loadEvent(id: string) {

    console.log('Iniciando carregamento do evento:', id);

    this.loading = true;

    this.eventsSvc.getById(id).subscribe({

      next: (eventModel) => {

        console.log('Evento recebido do backend:', eventModel);
        console.log('isSubscribed recebido:', eventModel?.isSubscribed);
        console.log('subscribersCount recebido:', eventModel?.subscribersCount);

        this.event = eventModel;
        this.loading = false;

        console.log('Evento atribuído ao componente:', this.event);
      },

      error: (err) => {

        console.error('Erro ao carregar evento:', err);

        this.loading = false;

        console.warn('Redirecionando para /home devido ao erro');
        this.router.navigateByUrl('/home');
      }
    });
  }

  // =========================
  // TOGGLE INSCRIÇÃO
  // =========================

  // =========================
// TOGGLE INSCRIÇÃO (Soft Delete)
// =========================
toggleSubscription() {
  console.log('========== TOGGLE SUBSCRIPTION ==========');

  if (!this.event) {
    console.warn('Evento inexistente. Abortando.');
    return;
  }

  if (this.loadingId) {
    console.warn('Já existe requisição em andamento:', this.loadingId);
    return;
  }

  console.log('Estado antes da ação:', {
    id: this.event.id,
    isSubscribed: this.event.isSubscribed,
    subscribersCount: this.event.subscribersCount,
    maxCapacity: this.event.maxCapacity,
    isFull: this.isFull,
    isPast: this.isPast
  });

  this.loadingId = this.event.id;

  if (this.event.isSubscribed) {
    // =========================
    // Cancelamento (soft delete)
    // =========================
    console.log('Usuário está inscrito. Cancelando inscrição...');

    this.eventsSvc.unsubscribe(this.event.id).subscribe({
      next: (response) => {
        console.log('Cancelamento realizado com sucesso.');
        console.log('Resposta do backend:', response);

        // Atualiza estado local
        this.event!.isSubscribed = false;
        this.event!.subscribersCount = Math.max(
          0,
          (this.event!.subscribersCount ?? 0) - 1
        );

        console.log('Estado após cancelamento:', {
          isSubscribed: this.event!.isSubscribed,
          subscribersCount: this.event!.subscribersCount
        });

        this.loadingId = null;
      },
      error: (err) => {
        console.error('Erro ao cancelar inscrição:', err);
        this.loadingId = null;
      }
    });
  } else {
    // =========================
    // Inscrição (ou reativação de cancelada)
    // =========================
    console.log('Usuário NÃO está inscrito. Realizando inscrição...');

    this.eventsSvc.subscribe(this.event.id).subscribe({
      next: (response: any) => {
        console.log('Inscrição realizada com sucesso.');
        console.log('Resposta do backend:', response);

        // Atualiza estado local
        this.event!.isSubscribed = true;
        this.event!.subscribersCount =
          (this.event!.subscribersCount ?? 0) + 1;

        console.log('Estado após inscrição:', {
          isSubscribed: this.event!.isSubscribed,
          subscribersCount: this.event!.subscribersCount
        });

        this.loadingId = null;
      },
      error: (err: any) => {
        console.error('Erro ao inscrever:', err);

        // Backend pode informar que já estava inscrito (soft delete)
        if (err?.error?.message?.includes('Already')) {
          console.warn('Backend informou que já estava inscrito.');
          this.event!.isSubscribed = true;
        }

        this.loadingId = null;
      }
    });
  }
}


  // =========================
  // HELPERS
  // =========================

  back() {
    console.log('Voltando para Home...');
    this.router.navigateByUrl('/home');
  }

  get isPast(): boolean {
    if (!this.event?.startDate) return false;

    const result = new Date(this.event.startDate).getTime() < Date.now();

    console.log('isPast calculado:', result);

    return result;
  }

  get isFull(): boolean {
    if (!this.event) return false;

    const result =
      (this.event.subscribersCount ?? 0) >= this.event.maxCapacity;

    console.log('isFull calculado:', result);

    return result;
  }

  get subscribed(): boolean {
    return !!this.event?.isSubscribed;
  }

  refresh(ev: any) {
    console.log('🔄 Pull to refresh acionado');

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      ev.target.complete();
      return;
    }

    // força refetch do backend
    this.eventsSvc.clearCache();
    this.loadEvent(id);

    setTimeout(() => {
      ev.target.complete();
    }, 600);
  }

}
