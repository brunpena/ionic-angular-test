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
import { PushService } from 'src/app/features/push.service';  

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner,
    ReactiveFormsModule
  ]
})
export class RegisterPage {

  loading = false;
  errorMsg = '';

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
    },
    { validators: this.passwordsMatchValidator }
  );

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private push: PushService
  ) {}

  // =========================
  // VALIDATOR
  // =========================
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  // =========================
  // SUBMIT
  // =========================
  register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { confirmPassword, ...payload } = this.form.value;

    this.auth.register(payload as any)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: async () => {
          try {
            // 🔔 inicia push após cadastro/login
            await this.push.init();
          } catch (err) {
            console.warn('[Push] Falha ao inicializar após cadastro', err);
          }

          this.router.navigateByUrl('/home');
        },
        error: (err: any) => {
          this.errorMsg = err?.error?.message || 'Falha no cadastro';
        }
      });
  }

  // =========================
  // NAV
  // =========================
  goLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
