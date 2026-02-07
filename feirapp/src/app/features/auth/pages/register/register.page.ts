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
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import gsap from 'gsap';

// Custom validator for password matching
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    ReactiveFormsModule
  ],
})
export class RegisterPage implements OnInit, AfterViewInit {
  registerForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  @ViewChild('registerPanel')
  panel!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group(
      {
        name: [
          '',
          [Validators.required, Validators.minLength(3)]
        ],
        email: [
          '',
          [Validators.required, Validators.email]
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(6)]
        ],
        confirmPassword: [
          '',
          [Validators.required]
        ]
      },
      { validators: passwordMatchValidator }
    );
  }

  ngAfterViewInit() {
    this.animatePanel();
  }

  animatePanel() {
    if (this.panel) {
      gsap.to(this.panel.nativeElement, {
        y: 0,
        duration: 0.8,
        ease: 'power4.out'
      });
    }
  }

  get nameControl() {
    return this.registerForm.get('name');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  isNameInvalid(): boolean {
    const control = this.nameControl;
    return !!(control && control.invalid && control.touched);
  }

  isEmailInvalid(): boolean {
    const control = this.emailControl;
    return !!(control && control.invalid && control.touched);
  }

  isPasswordInvalid(): boolean {
    const control = this.passwordControl;
    return !!(control && control.invalid && control.touched);
  }

  isConfirmPasswordInvalid(): boolean {
    const control = this.confirmPasswordControl;
    const formErrors = this.registerForm.errors;
    return !!(
      (control && control.invalid && control.touched) ||
      (control && control.touched && formErrors && formErrors['passwordMismatch'])
    );
  }

  getNameError(): string {
    const control = this.nameControl;
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Name is required';
    if (control.errors['minlength']) return 'Name must be at least 3 characters';

    return '';
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

  getConfirmPasswordError(): string {
    const control = this.confirmPasswordControl;
    const formErrors = this.registerForm.errors;

    if (!control || (!control.errors && !formErrors)) return '';

    if (control?.errors?.['required']) return 'Please confirm your password';
    if (formErrors && formErrors['passwordMismatch']) return 'Passwords do not match';

    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    if (!this.registerForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const { name, email, password } = this.registerForm.value;

    // TODO: Call actual auth service here with name, email, password
    console.log('Attempting registration with:', { name, email });

    setTimeout(() => (this.loading = false), 1200);
  }
}
