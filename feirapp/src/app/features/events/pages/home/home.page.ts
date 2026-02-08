import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonDatetime,
  IonItem
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../../../shared/models/event.model';
import { EventCardComponent } from '../components/event-card/event-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonDatetime,
    IonItem,
    EventCardComponent
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  allEvents: EventModel[] = [];
  visibleEvents: EventModel[] = [];

  search = '';
  filter: 'all' | 'month' | 'year' = 'all';
  category = '';

  dateFrom?: string;
  dateTo?: string;

  page = 1;
  pageSize = 6;

  constructor(
    private router: Router,
    public svc: EventService
  ) {}

  ngOnInit() {
    this.svc.list().subscribe(list => {
      this.allEvents = list;
      this.applyFilters(true);
    });
  }

  applyFilters(reset = false) {
    if (reset) this.page = 1;

    let filtered = [...this.allEvents];

    // 🔍 Busca
    if (this.search) {
      const s = this.search.toLowerCase();
      filtered = filtered.filter(e =>
        e.titulo.toLowerCase().includes(s) ||
        (e.descricao || '').toLowerCase().includes(s)
      );
    }

    // 🏷 Categoria
    if (this.category) {
      filtered = filtered.filter(e => e.categoria === this.category);
    }

    // 📅 Filtro rápido
    const now = new Date();

    if (this.filter === 'month') {
      filtered = filtered.filter(e => {
        const d = new Date(e.dataInicio);
        return d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
      });
    }

    if (this.filter === 'year') {
      filtered = filtered.filter(e => {
        const d = new Date(e.dataInicio);
        return d.getFullYear() === now.getFullYear();
      });
    }

    // 📆 Intervalo manual
    if (this.dateFrom) {
      const from = new Date(this.dateFrom).getTime();
      filtered = filtered.filter(e => new Date(e.dataInicio).getTime() >= from);
    }

    if (this.dateTo) {
      const to = new Date(this.dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.dataInicio).getTime() <= to.getTime());
    }

    this.visibleEvents = filtered.slice(0, this.page * this.pageSize);
  }

  onSearch(ev: any) {
    this.search = ev.detail.value || '';
    this.applyFilters(true);
  }

  refresh(ev: any) {
    this.applyFilters(true);
    ev.target.complete();
  }

  loadMore(ev: any) {
    this.page++;
    this.applyFilters();
    ev.target.complete();
  }

  goToMyEvents() {
    this.router.navigateByUrl('/events/my');
  }

  openEvent(id: string) {
    this.router.navigateByUrl(`/events/detail/${id}`);
  }

  isPastEvent(event: EventModel): boolean {
    const end = event.dataFim
      ? new Date(event.dataFim)
      : new Date(event.dataInicio);

    return end.getTime() < Date.now();
  }
}
