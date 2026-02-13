import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { ToastService } from '../services/toast.service';

const TOKEN_KEY = 'auth_token';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(err => {

      let message = 'Erro inesperado';

      // 🌐 Offline / Backend caiu
      if (!err.status || err.status === 0) {
        message = 'Não foi possível conectar ao servidor';
      }

      // ❌ Validação
      else if (err.status === 400) {
        message = err.error?.message ?? 'Dados inválidos';
      }

      // 🔐 Token inválido / expirado
      else if (err.status === 401) {

        message = 'Sessão expirada. Faça login novamente.';

        // remove token
        localStorage.removeItem(TOKEN_KEY);

        // evita loop de navegação
        if (!router.url.includes('/auth/login')) {
          router.navigate(['/auth/login'], { replaceUrl: true });
        }
      }

      // 🚫 Permissão
      else if (err.status === 403) {
        message = 'Você não tem permissão para esta ação';
      }

      // 🔍 Not found
      else if (err.status === 404) {
        message = 'Recurso não encontrado';
      }

      // 💥 Server crash
      else if (err.status >= 500) {
        message = 'Erro interno do servidor';
      }

      // ⭐ POPUP GLOBAL
      toast.show(message);

      console.error(`[HTTP ${err.status}]`, message, err);

      return throwError(() => ({
        ...err,
        userMessage: message,
      }));
    })
  );
};
