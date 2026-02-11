import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { HeaderComponent } from './header/header.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    IonContent,
    HeaderComponent
  ],
  template: `
    <!-- HEADER GLOBAL -->
    <app-header (logout)="logout()"></app-header>

    <!-- CONTEÚDO DAS ROTAS -->
    <ion-content fullscreen>
      <router-outlet></router-outlet>
    </ion-content>
  `
})
export class AppLayoutComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
