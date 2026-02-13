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

import { HeaderComponent } from '../../../../layout/header/header.component';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
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
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMsg = '';

  this.auth.login(this.form.value as any)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: async () => {
        try {
          // 🔔 inicia push APÓS login
          await this.push.init();
        } catch (err) {
          console.warn('[Push] Falha ao inicializar', err);
          // não bloqueia login por causa de push
        }

        this.router.navigateByUrl('/home');
      },
      error: (err: any) => {
        this.errorMsg = err?.error?.message || 'Falha no login';
      }
    });
}

  goRegister() {
    this.router.navigateByUrl('/auth/register');
  }
}
