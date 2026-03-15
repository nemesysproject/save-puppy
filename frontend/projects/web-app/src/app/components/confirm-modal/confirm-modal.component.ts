import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-confirm-modal",
	standalone: true,
	imports: [CommonModule],
	template: `
    <ng-container *ngIf="isOpen()">
      <div class="modal fade show d-block" tabindex="-1" role="dialog" style="z-index: 1060;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow-lg border-0">
            <div class="modal-header" [ngClass]="headerClass()">
              <h5 class="modal-title text-white">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ title }}
              </h5>
              <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="close()"></button>
            </div>
            <div class="modal-body p-4 text-center">
              <p class="fs-5 mb-0">{{ message }}</p>
              <p *ngIf="subMessage" class="text-muted small mt-2">{{ subMessage }}</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-light px-4 mx-2" (click)="close()">Cancelar</button>
              <button type="button" class="btn px-4 mx-2" [ngClass]="confirmBtnClass()" (click)="confirm()">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" style="z-index: 1050;" (click)="close()"></div>
    </ng-container>
  `,
	styles: [
		`
    .modal-header.bg-danger { background-color: #dc3545 !important; }
    .modal-header.bg-warning { background-color: #ffc107 !important; }
    .modal-backdrop { z-index: 1040; background-color: rgba(0,0,0,0.5); }
    .modal { z-index: 1050; }
    .modal-content { border-radius: 12px; }
  `,
	],
})
export class ConfirmModalComponent {
	@Input() title = "Confirmar Acción";
	@Input() message = "¿Estás seguro de que deseas realizar esta acción?";
	@Input() subMessage = "";
	@Input() confirmText = "Confirmar";
	@Input() type: "danger" | "warning" | "primary" = "danger";

	@Output() onConfirm = new EventEmitter<void>();
	@Output() onCancel = new EventEmitter<void>();

	isOpen = signal(false);

	open() {
		this.isOpen.set(true);
	}

	close() {
		this.isOpen.set(false);
		this.onCancel.emit();
	}

	confirm() {
		this.isOpen.set(false);
		this.onConfirm.emit();
	}

	headerClass() {
		return {
			"bg-danger": this.type === "danger",
			"bg-warning": this.type === "warning",
			"bg-primary": this.type === "primary",
		};
	}

	confirmBtnClass() {
		return {
			"btn-danger": this.type === "danger",
			"btn-warning": this.type === "warning",
			"btn-primary": this.type === "primary",
		};
	}
}
