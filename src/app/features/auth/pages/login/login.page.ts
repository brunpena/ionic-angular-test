import { Component } from '@angular/core';
import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonSpinner
} from '@ionic/angular/standalone';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth.service';
import { PushService } from 'src/app/features/push.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner,
    ReactiveFormsModule,
  ]
})
export class LoginPage {

  loading = false;
  errorMsg = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private push: PushService
  ) {}

  login() {
    // 🔒 bloqueia múltiplos submits
    if (this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const payload = this.form.getRawValue();

    this.auth.login(payload as any)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: async () => {
          try {
            // Push NÃO pode quebrar login
            await this.push.init();
          } catch (err) {
            console.warn('[Push] Erro ignorado no login', err);
          }

          this.router.navigateByUrl('/home', { replaceUrl: true });
        },

        error: (err: any) => {
          // 🌐 erro de rede / CORS / backend off
          if (err?.status === 0) {
            this.errorMsg = 'Não foi possível conectar ao servidor.';
            return;
          }

          // 🔐 credenciais inválidas
          if (err?.status === 401) {
            this.errorMsg = 'Email ou senha incorretos.';
            return;
          }

          // ⚠️ fallback seguro
          this.errorMsg =
            err?.error?.message ||
            'Falha ao realizar login. Tente novamente.';
        }
      });
  }

  goRegister() {
    if (this.loading) return;
    this.router.navigateByUrl('/auth/register');
  }
}
