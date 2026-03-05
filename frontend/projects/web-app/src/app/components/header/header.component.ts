import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'shared-logic';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal(this.authService.getCurrentUser());
  isDropdownOpen = signal(false);

  constructor() {
    // Suscribirse a cambios en auth$ para actualizar user signal
    this.authService.auth$.subscribe(user => {
      this.user.set(user);
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(val => !val);
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
