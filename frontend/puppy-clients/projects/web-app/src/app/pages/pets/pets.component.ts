import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { PetsTableComponent } from './pets-table/pets-table.component';
import { Pet } from 'shared-logic';
import { environment } from '../../../environments/environment';
import { AuthService } from 'shared-logic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PetsTableComponent],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export class PetsComponent {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  pets = signal<Pet[] | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  search = signal('');
  filtered = computed(() => {
    const list = this.pets() || [];
    const q = this.search().trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.status || '').toLowerCase().includes(q) ||
      (p.shelterId || '').toLowerCase().includes(q)
    );
  });

  private router = inject(Router);

  constructor() {
    this.loadPets();
  }

  private loadPets(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const token = this.auth.getBearerToken();
    const headers = token
      ? new HttpHeaders({ Authorization: token })
      : new HttpHeaders();

    this.http
      .get<Pet[]>(`${environment.apiUrl}/api/pets`, { headers })
      .subscribe({
        next: (res) => this.pets.set(res ?? []),
        error: (err) => this.error.set(err?.error?.message || 'Error cargando mascotas'),
        complete: () => this.isLoading.set(false)
      });
  }
  createPet(): void {
    this.router.navigate(['/pets/create']);
  }
}
