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
import { PushService } from 'src/app/features/push.service';

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

  // 🔐 validação de senha
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;

    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  }

  register() {
    // 🔒 anti double submit
    if (this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { confirmPassword, ...payload } = this.form.getRawValue();

    this.auth.register(payload as any)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: async () => {
          try {
            await this.push.init();
          } catch (err) {
            console.warn('[Push] Erro ignorado no cadastro', err);
          }

          this.router.navigateByUrl('/home', { replaceUrl: true });
        },

        error: (err: any) => {
          if (err?.status === 0) {
            this.errorMsg = 'Servidor indisponível no momento.';
            return;
          }

          if (err?.status === 409) {
            this.errorMsg = 'Este email já está cadastrado.';
            return;
          }

          this.errorMsg =
            err?.error?.message ||
            'Erro ao criar conta. Tente novamente.';
        }
      });
  }

  goLogin() {
    if (this.loading) return;
    this.router.navigateByUrl('/auth/login');
  }
}
