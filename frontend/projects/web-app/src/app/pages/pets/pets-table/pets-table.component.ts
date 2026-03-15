import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
	inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Pet, PetService } from "shared-logic";
import { ConfirmModalComponent } from "../../../components/confirm-modal/confirm-modal.component";

@Component({
	selector: "app-pets-table",
	standalone: true,
	imports: [CommonModule, RouterLink, ConfirmModalComponent],
	templateUrl: "./pets-table.component.html",
	styleUrl: "./pets-table.component.scss",
})
export class PetsTableComponent {
	private petService = inject(PetService);

	@Input() pets: Pet[] = [];
	@Output() onDeleted = new EventEmitter<void>();

	@ViewChild("confirmModal") confirmModal!: ConfirmModalComponent;
	selectedPetId: string | null = null;
	isDeleting = false;

	confirmDelete(id: string) {
		this.selectedPetId = id;
		console.log("onDeleteConfirmed", this.selectedPetId);
		this.confirmModal.open();
	}

	onDeleteConfirmed() {
		console.log("onDeleteConfirmed", this.selectedPetId);
		if (this.selectedPetId) {
			this.isDeleting = true;
			this.petService.deletePet(this.selectedPetId).subscribe({
				next: () => {
					this.isDeleting = false;
					this.onDeleted.emit();
					this.selectedPetId = null;
				},
				error: (err) => {
					this.isDeleting = false;
					console.error("Error deleting pet:", err);
					alert("Error al eliminar la mascota");
				},
			});
		}
	}

	trackById(index: number, item: Pet) {
		return item.id;
	}
}
