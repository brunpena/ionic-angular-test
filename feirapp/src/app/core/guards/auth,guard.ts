import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Guard principal de autenticação
 *
 * ✔ Verifica sessão ativa
 * ✔ Suporta fluxo async
 * ✔ Redireciona preservando URL
 * ✔ Pronto para JWT/backend
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),

    map(user => {
      // Usuário autenticado
      if (user) {
        return true;
      }

      // Redireciona mantendo destino
      return router.createUrlTree(
        ['/auth/login'],
        {
          queryParams: {
            redirect: state.url
          }
        }
      );
    })
  );
};
