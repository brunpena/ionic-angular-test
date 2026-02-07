import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'events/home',
    loadComponent: () => import('./features/events/pages/home/home.page').then((m) => m.EventsHomePage),
  },
  {
    path: 'events/my',
    loadComponent: () => import('./features/events/pages/my-events/my-events.page').then((m) => m.MyEventsPage),
  },
  {
    path: 'events/detail',
    loadComponent: () => import('./features/events/pages/event-detail/event-detail.page').then((m) => m.EventDetailPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
