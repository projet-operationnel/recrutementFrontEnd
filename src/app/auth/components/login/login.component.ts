import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/Alert/alert.service';
import { Login } from '../../interfaces/login';
import { ResponseData } from '../../../shared/interfaces/response-data';
import { UserLogin } from '../../interfaces/user-login';
import { environment } from '../../../../environments/environment.development';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('formState', [
      state('login', style({
        transform: 'rotateY(0deg)',
        opacity: 1
      })),
      state('register', style({
        transform: 'rotateY(180deg)',
        opacity: 1
      })),
      transition('login => register', [
        animate('800ms ease-out', style({
          transform: 'rotateY(180deg)',
          opacity: 1
        }))
      ]),
      transition('register => login', [
        animate('800ms ease-out', style({
          transform: 'rotateY(0deg)',
          opacity: 1
        }))
      ])
    ]),
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(1.1)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'scale(1.1)' }))
      ])
    ])
  ]
})

export class LoginComponent {
  currentImage = 'login';
  isLogin = true;
  isLoading = false;
  errorMessage: { login: string; register: string } = {
    login: '',
    register: ''
  };

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  getErrorMessage(control: string, form: 'login' | 'register'): string {
    const formGroup = form === 'login' ? this.loginForm : this.registerForm;
    const field = formGroup.get(control);

    if (!field?.errors || !field.touched) return '';

    const errors = {
      required: 'Ce champ est requis',
      email: 'Email invalide',
      minlength: `Minimum ${field.errors['minlength']?.requiredLength} caractères`,
      pattern: 'Format invalide',
      passwordMismatch: 'Les mots de passe ne correspondent pas'
    };

    const firstError = Object.keys(field.errors)[0];
    return errors[firstError as keyof typeof errors] || '';
  }

  private resetForms(): void {
    if (this.isLogin) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
    }
    this.errorMessage = { login: '', register: '' };
  }

  login(): void {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage.login = '';

    this.authService.postData("login", this.loginForm.value).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: any) => {
        if (response.statusCode) {
          localStorage.setItem(environment.appName + "_token", response.data.token);
          localStorage.setItem(environment.appName + '_user', JSON.stringify(response.data.nom));
          this.resetForms();
          this.router.navigateByUrl('');
        } else {
          this.errorMessage.login = response.message;
        }
      },
      error: (error) => {
        this.errorMessage.login = error.error.message || 'Une erreur est survenue';
        console.error('Login error:', error);
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage.register = '';

    this.authService.postData("register", this.registerForm.value).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: any) => {
        // this.alertService.success('Inscription réussie !');
        this.resetForms();
        this.isLogin = true;
      },
      error: (error) => {
        this.errorMessage.register = error.message || 'Une erreur est survenue';
        console.error('Registration error:', error);
      }
    });
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.currentImage = this.isLogin ? 'login' : 'register';
    this.resetForms();
  }

}
