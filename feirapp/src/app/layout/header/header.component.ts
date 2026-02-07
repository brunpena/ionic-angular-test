import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() title = 'FeirApp';
  @Input() showMenu = true;
  @Input() showProfile = true;

  @Output() menuClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  onMenu() {
    this.menuClick.emit();
  }

  onProfile() {
    this.profileClick.emit();
  }
}
