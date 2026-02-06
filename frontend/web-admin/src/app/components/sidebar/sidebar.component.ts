import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navItems = signal<NavItem[]>([
    { label: 'Refugios', path: '/shelters', icon: '🏠' },
    { label: 'Mascotas', path: '/pets', icon: '🐕' },
    { label: 'Dueños', path: '/owners', icon: '👤' }
  ]);
}
