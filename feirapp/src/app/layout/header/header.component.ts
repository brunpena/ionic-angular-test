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
import { AuthHttpService } from '../../core/services/auth-http.service';

import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

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

  @Input() title = 'Feirapp';

  constructor(
    private auth: AuthHttpService,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  logout() {
    this.auth.logoutLocal();

    this.router.navigateByUrl('/auth/login', {
      replaceUrl: true
    });
  }
}
