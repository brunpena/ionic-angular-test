import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/core/services/subscriptions.service';
import { EventsService } from 'src/app/core/services/events.service';
import { EventModel } from 'src/app/shared/models/event.model';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [DatePipe]
})
export class MyEventsPage implements OnInit {

  events: EventModel[] = [];
  loading = false;
  segment: 'upcoming' | 'past' = 'upcoming';

  constructor(
    private router: Router,
    private eventsSvc: EventsService,
    private subscriptionsSvc: SubscriptionsService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  get filteredEvents(): EventModel[] {
    return this.events;
  }

  loadSubscriptions() {
    this.loading = true;

    if (this.segment === 'upcoming') {
      // Próximos eventos inscritos
      this.eventsSvc.list().subscribe(allEvents => {
        this.events = allEvents.data.filter(e => e.isSubscribed);
        this.loading = false;
      });
    } else {
      // Eventos passados do usuário
      this.subscriptionsSvc.pastSubscriptions().subscribe((subscriptions: any[]) => {
        this.events = subscriptions
          .filter(s => s.event) // segurança extra
          .map(s => ({
            ...s.event,
            cancelledAt: s.cancelledAt,
            subscribersCount: s.event.subscriptions?.length || 0,
            isSubscribed: false
          }));

        this.loading = false;
      });
    }
  }

  refresh(ev: any) {
    this.loadSubscriptions();
    setTimeout(() => ev.target.complete(), 600);
  }

  openEvent(id: string) {
    this.router.navigateByUrl(`/events/detail/${id}`);
  }

  canCancel(event: EventModel): boolean {
    return this.segment === 'upcoming' && new Date(event.startDate) > new Date();
  }

  cancelSubscription(event: EventModel, ev: Event) {
    ev.stopPropagation();
    this.subscriptionsSvc.cancel(event.id).subscribe(async () => {
      this.events = this.events.filter(e => e.id !== event.id);

      const toast = await this.toastCtrl.create({
        message: `Inscrição em "${event.title}" cancelada.`,
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    });
  }

  segmentChanged() {
    this.loadSubscriptions();
  }

  goBack() {
    this.router.navigateByUrl('/menu'); // ajuste conforme sua rota de menu
  }
}
