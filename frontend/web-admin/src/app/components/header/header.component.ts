import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="header-left">
          <h1 class="title">🐾 Save Puppy Admin</h1>
        </div>
        <div class="header-right">
          <div class="profile">
            <img src="https://via.placeholder.com/40" alt="Perfil" class="avatar" />
            <span class="username">{{ username() }}</span>
          </div>
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .title {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .username {
      font-weight: 500;
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .header-right {
        gap: 1rem;
        flex-direction: column;
      }

      .title {
        font-size: 1.3rem;
      }
    }
  `]
})
export class HeaderComponent {
  username = signal('Admin User');

  constructor(private router: Router) { }

  logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      this.router.navigate(['/login']);
    }
  }
}
