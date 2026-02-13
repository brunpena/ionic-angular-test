import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/core/services/subscriptions.service';
import { EventsService } from 'src/app/core/services/events.service';
import { EventModel } from 'src/app/shared/models/event.model';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MyEventsPage implements OnInit {

  events: EventModel[] = [];
  loading = false;

  segment: 'subscribed' | 'past' = 'subscribed';

  constructor(
    private router: Router,
    private eventsSvc: EventsService,
    private subscriptionsSvc: SubscriptionsService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  /** ========= CARREGAMENTO ========= */

  loadEvents() {
    this.loading = true;

    if (this.segment === 'subscribed') {
      this.loadSubscribedEvents();
    } else {
      this.loadPastEvents();
    }
  }

  /** ========= INSCRITOS ========= */

  private loadSubscribedEvents() {
    const now = new Date();

    this.eventsSvc.list().subscribe({
      next: res => {
        this.events = res.data.filter(event =>
          event.isSubscribed &&
          new Date(event.startDate) >= now
        );
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  /** ========= PASSADOS ========= */

  private loadPastEvents() {
    this.subscriptionsSvc.pastSubscriptions().subscribe({
      next: (subscriptions: any[]) => {
        this.events = subscriptions
          .filter(s => s.event)
          .map(s => ({
            ...s.event,
            cancelledAt: s.cancelledAt,
            subscribersCount: s.event.subscriptions?.length ?? 0,
            isSubscribed: false,
          }));

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  /** ========= UI ========= */

  get filteredEvents(): EventModel[] {
    return this.events;
  }

  segmentChanged() {
    this.loadEvents();
  }

  refresh(ev: any) {
    this.loadEvents();
    setTimeout(() => ev.target.complete(), 600);
  }

  openEvent(id: string) {
    this.router.navigateByUrl(`/events/detail/${id}`);
  }

  canCancel(event: EventModel): boolean {
    return this.segment === 'subscribed' &&
           new Date(event.startDate) > new Date();
  }

  cancelSubscription(event: EventModel, ev: Event) {
    ev.stopPropagation();

    this.subscriptionsSvc.cancel(event.id).subscribe(async () => {
      this.events = this.events.filter(e => e.id !== event.id);

      const toast = await this.toastCtrl.create({
        message: `Inscrição em "${event.title}" cancelada.`,
        duration: 2000,
        color: 'danger',
        position: 'top',
      });

      await toast.present();
    });
  }

  goBack() {
    this.router.navigateByUrl('/menu');
  }
}
