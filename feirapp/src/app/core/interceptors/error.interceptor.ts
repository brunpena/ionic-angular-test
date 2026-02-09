import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {
      let message = 'Erro inesperado';

      // 🌐 Backend fora / CORS / sem internet
      if (err.status === 0) {
        message = 'Não foi possível conectar ao servidor';
      }

      // ❌ Erro de validação
      else if (err.status === 400) {
        message = err.error?.message || 'Dados inválidos';
      }

      // 🔐 Token inválido / expirado
      else if (err.status === 401) {
        message = 'Sessão expirada. Faça login novamente.';
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      // 🚫 Sem permissão
      else if (err.status === 403) {
        message = 'Você não tem permissão para esta ação';
      }

      // 🔍 Não encontrado
      else if (err.status === 404) {
        message = 'Recurso não encontrado';
      }

      // 💥 Erro interno
      else if (err.status >= 500) {
        message = 'Erro interno do servidor';
      }

      console.error(`[HTTP ${err.status}]`, message, err);

      return throwError(() => ({
        ...err,
        userMessage: message,
      }));
    })
  );
};
