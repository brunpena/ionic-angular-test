import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [

  // ========= AUTH =========
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/pages/login/login.page')
            .then(m => m.LoginPage),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/auth/pages/register/register.page')
            .then(m => m.RegisterPage),
      }
    ]
  },

  // ========= APP COM HEADER =========
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-layout.component')
        .then(m => m.AppLayoutComponent),

    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/events/pages/home/home.page')
            .then(m => m.HomePage),
      },
      {
        path: 'events/home',
        loadComponent: () =>
          import('./features/events/pages/home/home.page')
            .then(m => m.HomePage),
      },
      {
        path: 'events/my',
        loadComponent: () =>
          import('./features/events/pages/my-events/my-events.page')
            .then(m => m.MyEventsPage),
      },
      {
        path: 'events/detail/:id',
        loadComponent: () =>
          import('./features/events/pages/event-detail/event-detail.page')
            .then(m => m.EventDetailPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile.page')
            .then(m => m.ProfilePage),
      }
    ]
  },

  // ========= ROOT =========
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // ========= FALLBACK =========
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];
