import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  // Form Signals
  email = signal('');
  password = signal('');
  
  // UI State Signals
  isLoading = signal(false);
  errorMessage = signal('');

  // Update signal values on input change
  updateEmail(event: Event) {
    this.email.set((event.target as HTMLInputElement).value);
  }

  updatePassword(event: Event) {
    this.password.set((event.target as HTMLInputElement).value);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    
    // basic validation
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const loginData = {
      email: this.email(),
      password: this.password()
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Navigate to student list on success
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        // Show error message
        this.errorMessage.set('Invalid email or password.');
      }
    });
  }
}