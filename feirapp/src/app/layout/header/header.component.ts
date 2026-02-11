import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  standalone: true, // 👈 OBRIGATÓRIO
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonIcon,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle
  ]
})
export class HeaderComponent {

  @Input() title = 'Feirapp';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  logout() {
    this.auth.logout();

    this.router.navigateByUrl('/auth/login', {
      replaceUrl: true
    });
  }
}
