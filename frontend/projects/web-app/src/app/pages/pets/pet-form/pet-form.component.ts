import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	inject,
	signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Pet, Kind, Gender, Shelter, LookupService } from "shared-logic";

@Component({
	selector: "app-pet-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: "./pet-form.component.html",
	styleUrl: "./pet-form.component.scss",
})
export class PetFormComponent implements OnInit {
	private fb = inject(FormBuilder);
	private lookupService = inject(LookupService);

	@Input() pet: Pet | null = null;
	@Input() isLoading = false;
	@Output() onSubmit = new EventEmitter<any>();
	@Output() onCancel = new EventEmitter<void>();

	petForm: FormGroup;
	kinds = signal<Kind[]>([]);
	genders = signal<Gender[]>([]);
	shelters = signal<Shelter[]>([]);

	constructor() {
		this.petForm = this.fb.group({
			name: ["", [Validators.required]],
			status: ["LOST", [Validators.required]],
			kindId: ["", [Validators.required]],
			genderId: ["", [Validators.required]],
			shelterId: [""],
			ownerEmail: ["", [Validators.required, Validators.email]],
		});
	}

	ngOnInit(): void {
		this.loadLookups();
		if (this.pet) {
			this.petForm.patchValue(this.pet);
		}
	}

	private loadLookups(): void {
		this.lookupService
			.getKinds()
			.subscribe((res: Kind[]) => this.kinds.set(res));
		this.lookupService
			.getGenders()
			.subscribe((res: Gender[]) => this.genders.set(res));
		this.lookupService
			.getShelters()
			.subscribe((res: Shelter[]) => this.shelters.set(res));
	}

	submit(): void {
		if (this.petForm.valid) {
			this.onSubmit.emit(this.petForm.value);
		}
	}

	cancel(): void {
		this.onCancel.emit();
	}
}
