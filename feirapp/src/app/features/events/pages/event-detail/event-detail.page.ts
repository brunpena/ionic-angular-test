import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonButton, IonImg } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';

import { EventService } from '../../services/event.service';
import { EventModel } from '../../../../shared/models/event.model';

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
    private svc: EventService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.svc.getById(id).subscribe({
      next: ev => this.event = ev,
      error: () => this.event = undefined
    });
  }

  back() {
    this.router.navigateByUrl('/home');
  }

  subscribe() {
    if (!this.event || this.loading) return;

    this.loading = true;
    this.svc.subscribe(this.event.id).subscribe({
      next: ok => {
        this.loading = false;
        if (ok) {
          this.event!.inscritosCount = Math.min(this.event!.lotacaoMax, this.event!.inscritosCount + 1);
        }
      },
      error: () => this.loading = false
    });
  }

  unsubscribe() {
    if (!this.event || this.loading) return;

    this.loading = true;
    this.svc.unsubscribe(this.event.id).subscribe({
      next: ok => {
        this.loading = false;
        if (ok) {
          this.event!.inscritosCount = Math.max(0, this.event!.inscritosCount - 1);
        }
      },
      error: () => this.loading = false
    });
  }

  // ===== GETTERS DE ESTADO =====

  get isFull(): boolean {
    return !!this.event && this.event.inscritosCount >= this.event.lotacaoMax;
  }

  get isPast(): boolean {
    return !!this.event && new Date(this.event.dataInicio).getTime() < Date.now();
  }

  get subscribed(): boolean {
    return !!this.event && this.svc.isSubscribed(this.event.id);
  }
}
