import { Component, Input } from '@angular/core';
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
import {
  logOutOutline,
  addCircleOutline,
  personCircleOutline
} from 'ionicons/icons';

@Component({
  standalone: true,
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
    addIcons({
      logOutOutline,
      addCircleOutline,
      personCircleOutline
    });
  }

  goHome() {
    this.router.navigateByUrl('/home'); // ajuste se sua rota for outra
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  logout() {
  this.auth.logout().subscribe({
    next: () => {
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    },
    error: () => {
      // mesmo se der erro limpa navegação
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    }
  });
}
}
