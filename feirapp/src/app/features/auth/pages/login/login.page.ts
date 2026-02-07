import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    ReactiveFormsModule
  ],
})
export class LoginPage implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  loading = false;
  showPassword = false;

  @ViewChild('loginPanel')
  panel!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  ngAfterViewInit() {
    this.animatePanel();
  }

  animatePanel() {
    if (this.panel) {
      gsap.from(this.panel.nativeElement, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power4.out'
      });
    }
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  isEmailInvalid(): boolean {
    const control = this.emailControl;
    return !!(control && control.invalid && control.touched);
  }

  isPasswordInvalid(): boolean {
    const control = this.passwordControl;
    return !!(control && control.invalid && control.touched);
  }

  getEmailError(): string {
    const control = this.emailControl;
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Email is required';
    if (control.errors['email']) return 'Please enter a valid email';

    return '';
  }

  getPasswordError(): string {
    const control = this.passwordControl;
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Password is required';
    if (control.errors['minlength']) {
      return `Password must be at least ${control.errors['minlength'].requiredLength} characters`;
    }

    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.loginForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    // TODO: Call actual auth service here
    console.log('Attempting login with:', { email });

    setTimeout(() => (this.loading = false), 1200);
  }
}


