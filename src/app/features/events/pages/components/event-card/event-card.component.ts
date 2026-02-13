import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
} from '@ionic/angular/standalone';
import { EventModel } from '../../../../../shared/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonButton
  ],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent {

  @Input() event!: EventModel;
  @Input() subscribed?: boolean = false;
  @Input() loadingId!: string | null;

  @Output() subscribeToggle = new EventEmitter<EventModel>();

  @Output() open = new EventEmitter<string>();

  @HostListener('click')
  onOpen() {
    this.open.emit(this.event.id);
  }

  onSubscribe(ev: Event) {
    ev.stopPropagation();
    this.subscribeToggle.emit(this.event);
  }

  get occupancyPercentage(): number {
    if (!this.event?.maxCapacity) return 0;
    return ((this.event.subscribersCount || 0) / this.event.maxCapacity) * 100;
  }

  get capacityStatus(): 'low' | 'medium' | 'full' {
    const percent = this.occupancyPercentage;

    if (percent >= 100) return 'full';
    if (percent >= 80) return 'medium';
    return 'low';
  }

  get isFull(): boolean {
    return this.capacityStatus === 'full';
  }

  get isPast(): boolean {
    if (!this.event?.startDate) return false;
    return new Date(this.event.startDate).getTime() < Date.now();
  }
}
