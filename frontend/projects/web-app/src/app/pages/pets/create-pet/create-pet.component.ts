import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { PetService, CreatePetRequest } from "shared-logic";
import { PetFormComponent } from "../pet-form/pet-form.component";

@Component({
	selector: "app-create-pet",
	standalone: true,
	imports: [CommonModule, PetFormComponent],
	template: `
    <div class="container mt-4">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">Registrar Nueva Mascota</h4>
        </div>
        <div class="card-body">
          <div *ngIf="error()" class="alert alert-danger">{{ error() }}</div>
          <app-pet-form 
            [isLoading]="isLoading()" 
            (onSubmit)="createPet($event)" 
            (onCancel)="goBack()">
          </app-pet-form>
        </div>
      </div>
    </div>
  `,
})
export class CreatePetComponent {
	private petService = inject(PetService);
	private router = inject(Router);

	isLoading = signal(false);
	error = signal<string | null>(null);

	createPet(data: CreatePetRequest): void {
		this.isLoading.set(true);
		this.error.set(null);

		this.petService.createPet(data).subscribe({
			next: () => {
				this.router.navigate(["/pets"]);
			},
			error: (err: any) => {
				this.isLoading.set(false);
				this.error.set(
					err?.error?.error || err?.error?.message || "Error al crear mascota",
				);
			},
		});
	}

	goBack(): void {
		this.router.navigate(["/pets"]);
	}
}
