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
  IonItem,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { EventsService as EventService } from 'src/app/core/services/events.service';
import { EventModel } from '../../../../shared/models/event.model';
import { EventCardComponent } from '../components/event-card/event-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonIcon,
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

  loadingId: string | null = null;

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

  toggleSubscription(event: EventModel) {

    if (this.loadingId) return; // evita múltiplos cliques

    this.loadingId = event.id;

    if (event.isSubscribed) {

      this.svc.unsubscribe(event.id).subscribe({
        next: () => {
          event.isSubscribed = false;

          event.subscribersCount = Math.max(
            0,
            (event.subscribersCount ?? 0) - 1
          );

          this.loadingId = null;
        },
        error: () => {
          this.loadingId = null;
        }
      });

    } else {

      this.svc.subscribe(event.id).subscribe({
        next: () => {
          event.isSubscribed = true;

          event.subscribersCount =
            (event.subscribersCount ?? 0) + 1;

          this.loadingId = null;
        },
        error: () => {
          this.loadingId = null;
        }
      });

    }
  }



  // ============================
  // INIT
  // ============================

  ngOnInit() {
    this.svc.list().subscribe((response: any) => {

      const list = response?.data ?? [];
      console.log(list)


      this.allEvents = list.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        description: ev.description,
        imageUrl: ev.imageUrl,

        startDate: ev.startDate,
        endDate: ev.endDate,

        location: ev.location,
        city: ev.city,

        category: ev.category,
        maxCapacity: ev.maxCapacity,

        // ✅ quantidade correta vinda do _count
        subscribersCount: ev.subscribersCount,

        // ⚠️ enquanto o back não mandar, vamos assumir false
        isSubscribed: ev.isSubscribed ?? false,

        createdAt: ev.createdAt,
        updatedAt: ev.updatedAt
      }));

      console.log(this.allEvents)

      this.applyFilters(true);
    });
  }

  // ============================
  // NAVIGATION
  // ============================

  goToCreateEvent() {
    this.router.navigateByUrl('/events/create');
  }

  goToMyEvents() {
    this.router.navigateByUrl('/events/my');
  }

  openEvent(id: string) {
    this.router.navigateByUrl(`/events/detail/${id}`);
  }

  // ============================
  // FILTERS
  // ============================

  applyFilters(reset = false) {

    if (reset) this.page = 1;

    let filtered = [...this.allEvents];

    // 🔍 SEARCH
    if (this.search) {
      const s = this.search.toLowerCase();

      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(s) ||
        (e.description || '').toLowerCase().includes(s)
      );
    }

    // 🏷 CATEGORY
    if (this.category) {
      filtered = filtered.filter(e => e.category === this.category);
    }

    // 📅 QUICK FILTER
    const now = new Date();

    if (this.filter === 'month') {
      filtered = filtered.filter(e => {
        const d = new Date(e.startDate);
        return d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
      });
    }

    if (this.filter === 'year') {
      filtered = filtered.filter(e => {
        const d = new Date(e.startDate);
        return d.getFullYear() === now.getFullYear();
      });
    }

    // 📆 DATE RANGE
    if (this.dateFrom) {
      const from = new Date(this.dateFrom).getTime();
      filtered = filtered.filter(e =>
        new Date(e.startDate).getTime() >= from
      );
    }

    if (this.dateTo) {
      const to = new Date(this.dateTo);
      to.setHours(23, 59, 59, 999);

      filtered = filtered.filter(e =>
        new Date(e.startDate).getTime() <= to.getTime()
      );
    }

    // 📦 PAGINATION
    this.visibleEvents = filtered.slice(0, this.page * this.pageSize);
  }

  // ============================
  // EVENTS
  // ============================

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

  // ============================
  // HELPERS
  // ============================

  isPastEvent(event: EventModel): boolean {
    const end = event.endDate
      ? new Date(event.endDate)
      : new Date(event.startDate);

    return end.getTime() < Date.now();
  }
}
