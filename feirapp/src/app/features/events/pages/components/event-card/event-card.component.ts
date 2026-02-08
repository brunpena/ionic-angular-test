import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge } from '@ionic/angular/standalone';
import { EventModel } from '../../../../../shared/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent {
  @Input() event!: EventModel;
  @Input() subscribed = false;

  formatDate(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString();
  }

  get isFull() {
    return this.event?.inscritosCount >= this.event?.lotacaoMax;
  }

  get isPast() {
    return this.event ? new Date(this.event.dataInicio).getTime() < Date.now() : false;
  }
}
