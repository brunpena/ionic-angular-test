import { Component } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { AuthHttpService } from 'src/app/core/services/auth-http.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
  imports: [IonContent, IonButton]
})
export class MyEventsPage {

  constructor(
    private auth: AuthHttpService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }
}
