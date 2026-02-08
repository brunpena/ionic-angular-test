import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { HeaderComponent } from './header/header.component';
import { AuthHttpService } from '../core/services/auth-http.service';

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
    private auth: AuthHttpService,
    private router: Router
  ) {}

  logout() {
    this.auth.logoutLocal();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
