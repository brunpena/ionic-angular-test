import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  templateUrl: 'event-card.component.html',
  styleUrls: ['event-card.component.scss'],
  standalone: true,
})
export class EventCardComponent {
  @Input() title?: string;
  @Input() date?: string;
}
