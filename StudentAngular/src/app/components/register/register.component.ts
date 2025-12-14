import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  updateEmail(e: Event) { this.email.set((e.target as HTMLInputElement).value); }
  updatePassword(e: Event) { this.password.set((e.target as HTMLInputElement).value); }

  onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);
    this.errorMessage.set('');

    const data = {
      email: this.email(),
      password: this.password()
    };

    this.authService.register(data).subscribe({
      // 'res' will now be the success text from backend (e.g. "User created")
      next: (res) => {
        this.isLoading.set(false);
        alert('Registration successful! Please login.'); // Optional alert
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Register Error:', err);
        
        // Handle text error vs json error
        if (typeof err.error === 'string') {
           this.errorMessage.set(err.error);
        } else if (err.error?.message) {
           this.errorMessage.set(err.error.message);
        } else {
           this.errorMessage.set('Registration failed. Email might be taken.');
        }
      }
    });
  }
}