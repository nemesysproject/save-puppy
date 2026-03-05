import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: '🐙', url: 'https://github.com', label: 'GitHub' },
    { icon: '💼', url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: '📘', url: 'https://facebook.com', label: 'Facebook' },
    { icon: '📷', url: 'https://instagram.com', label: 'Instagram' },
  ];

  footerLinks = [
    { label: 'Sobre Nosotros', path: '#about' },
    { label: 'privacidad', path: '#privacy' },
    { label: 'Términos', path: '#terms' },
    { label: 'Contacto', path: '#contact' },
  ];
}
