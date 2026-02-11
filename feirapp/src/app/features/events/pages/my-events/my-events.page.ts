import { Component, OnInit } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { SubscriptionsService } from 'src/app/core/services/subscriptions.service';
import { EventModel } from 'src/app/shared/models/event.model';

@Component({
  standalone: true,
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
  imports: [IonContent, IonButton]
})
export class MyEventsPage implements OnInit {

  events: EventModel[] = [];
  loading = false;

  constructor(
    private auth: AuthService,
    private subsSvc: SubscriptionsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;

    this.subsSvc.mySubscriptions().subscribe(subs => {
      console.log('[MyEvents] subscriptions:', subs);

      // 🔁 MAP Subscription/Event → EventModel
      this.events = (subs as any[]).map(s => ({
        id: s.event.id,
        titulo: s.event.nome,
        descricao: s.event.descricao,
        imagemUrl: s.event.imagem,

        dataInicio: s.event.data,
        dataFim: undefined,

        local: s.event.local,
        cidade: '',

        lotacaoMax: 999,
        inscritosCount: s.event.inscritos,

        isSubscribed: true
      }));

      this.loading = false;
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  openEvent(id: string) {
    this.router.navigateByUrl(`/events/detail/${id}`);
  }
}
