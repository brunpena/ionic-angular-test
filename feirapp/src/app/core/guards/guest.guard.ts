import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
} from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * GuestGuard
 *
 * Permite acesso apenas se NÃO estiver autenticado
 * Caso esteja logado → redireciona para home
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),

    map(user => {
      // Usuário NÃO logado → pode acessar
      if (!user) {
        return true;
      }

      // Usuário logado → redireciona
      return router.createUrlTree(['/events/home']);
    })
  );
};
