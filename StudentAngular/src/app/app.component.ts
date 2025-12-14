import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styles: [`
    .navbar { display: flex; justify-content: space-between; padding: 1rem 2rem; background: #2c3e50; color: white; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .logo { font-size: 1.5rem; font-weight: bold; }
    button { background: #e74c3c; border: none; padding: 0.5rem 1rem; color: white; border-radius: 4px; cursor: pointer; margin-left: 10px; }
    button:hover { background: #c0392b; }
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
  `]
})
export class AppComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
