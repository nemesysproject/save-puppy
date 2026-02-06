import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Sobre Save Puppy</h4>
            <p>Plataforma integral para rescue, adopción y geolocalización de mascotas.</p>
          </div>
          <div class="footer-section">
            <h4>Redes Sociales</h4>
            <div class="social-links">
              <a 
                *ngFor="let social of socialLinks()"
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                [title]="social.name"
              >
                {{ social.icon }}
              </a>
            </div>
          </div>
          <div class="footer-section">
            <h4>Contacto</h4>
            <p>
              Email: <a href="mailto:info@savepuppy.com">info@savepuppy.com</a><br>
              Phone: <a href="tel:+34123456789">+34 123 456 789</a>
            </p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Save Puppy. Todos los derechos reservados. | Desarrollado por <strong>zutm</strong></p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2c3e50;
      color: #bdc3c7;
      padding: 3rem 2rem 1rem;
      margin-top: auto;
      border-top: 1px solid #34495e;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-section h4 {
      margin: 0;
      color: white;
      font-size: 1rem;
      font-weight: 600;
    }

    .footer-section p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .footer-section a {
      color: #667eea;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(102, 126, 234, 0.2);
      border-radius: 50%;
      font-size: 1.25rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .social-link:hover {
      background: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .footer-bottom {
      border-top: 1px solid #34495e;
      padding-top: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
    }

    .footer-bottom p {
      margin: 0;
    }

    .footer-bottom strong {
      color: #667eea;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 2rem 1rem 0.75rem;
      }

      .footer-content {
        gap: 1.5rem;
      }

      .footer-section {
        gap: 0.5rem;
      }

      .social-links {
        gap: 0.75rem;
      }

      .social-link {
        width: 36px;
        height: 36px;
        font-size: 1.1rem;
      }
    }
  `]
})
export class FooterComponent {
  socialLinks = signal<SocialLink[]>([
    { name: 'Facebook', url: 'https://facebook.com/savepuppy', icon: '👍' },
    { name: 'Instagram', url: 'https://instagram.com/savepuppy', icon: '📸' },
    { name: 'Twitter', url: 'https://twitter.com/savepuppy', icon: '🐦' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/savepuppy', icon: '💼' },
    { name: 'GitHub', url: 'https://github.com/savepuppy', icon: '🐙' }
  ]);
}
