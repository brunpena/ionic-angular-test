import { Routes } from '@angular/router';

export const eventsRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'my',
    loadComponent: () =>
      import('./pages/my-events/my-events.page').then(m => m.MyEventsPage),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/event-detail/event-detail.page')
        .then(m => m.EventDetailPage),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create-event/create-event.page')
        .then(m => m.CreateEventPage)
  },
];
