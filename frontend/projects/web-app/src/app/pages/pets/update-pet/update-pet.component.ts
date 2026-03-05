import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService, Pet, UpdatePetRequest } from 'shared-logic';
import { PetFormComponent } from '../pet-form/pet-form.component';

@Component({
    selector: 'app-update-pet',
    standalone: true,
    imports: [CommonModule, PetFormComponent],
    template: `
    <div class="container mt-4">
      <div class="card shadow-sm">
        <div class="card-header bg-warning text-dark">
          <h4 class="mb-0">Editar Mascota</h4>
        </div>
        <div class="card-body">
          <div *ngIf="isLoadingData()" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Cargando datos de la mascota...</p>
          </div>

          <div *ngIf="error()" class="alert alert-danger">{{ error() }}</div>

          <app-pet-form 
            *ngIf="pet()" 
            [pet]="pet()" 
            [isLoading]="isSaving()" 
            (onSubmit)="updatePet($event)" 
            (onCancel)="goBack()">
          </app-pet-form>
        </div>
      </div>
    </div>
  `
})
export class UpdatePetComponent implements OnInit {
    private petService = inject(PetService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    pet = signal<Pet | null>(null);
    isLoadingData = signal(true);
    isSaving = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadPet(id);
        } else {
            this.error.set('ID de mascota no proporcionado');
            this.isLoadingData.set(false);
        }
    }

    private loadPet(id: string): void {
        this.petService.getPetById(id).subscribe({
            next: (data: Pet) => {
                this.pet.set(data);
            },
            error: (err: any) => {
                this.error.set(err?.error?.error || 'Error al cargar los datos de la mascota');
            },
            complete: () => {
                this.isLoadingData.set(false);
            }
        });
    }

    updatePet(data: UpdatePetRequest): void {
        const id = this.pet()?.id;
        if (!id) return;

        this.isSaving.set(true);
        this.error.set(null);

        this.petService.updatePet(id, data).subscribe({
            next: () => {
                this.router.navigate(['/pets']);
            },
            error: (err: any) => {
                this.isSaving.set(false);
                this.error.set(err?.error?.error || err?.error?.message || 'Error al actualizar mascota');
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/pets']);
    }
}
