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
import { AuthHttpService } from '../../../../core/services/auth-http.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner,
    ReactiveFormsModule,
    HeaderComponent
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
    private auth: AuthHttpService,
    private router: Router
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
        next: () => this.router.navigateByUrl('/home'),
        error: err => this.errorMsg = err.message || 'Falha no login'
      });
  }

  goRegister() {
    this.router.navigateByUrl('/auth/register');
  }
}
