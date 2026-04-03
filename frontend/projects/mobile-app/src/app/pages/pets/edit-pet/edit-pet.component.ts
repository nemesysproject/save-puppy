import { Component, inject, OnInit, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonButtons,
	IonBackButton,
	IonButton,
	IonIcon,
	IonLabel,
	IonChip,
	IonSpinner,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
	cameraOutline,
	locationOutline,
	refreshOutline,
	closeOutline,
	pawOutline,
	trashOutline
} from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { PetService, LookupService, Kind, Gender, Race } from "shared-logic";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-edit-pet",
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonContent,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonButtons,
		IonBackButton,
		IonButton,
		IonIcon,
		IonLabel,
		IonChip,
		IonSpinner,
	],
	templateUrl: "./edit-pet.component.html",
	styleUrl: "./edit-pet.component.scss",
})
export class EditPetComponent implements OnInit {
	private petService = inject(PetService);
	private lookupService = inject(LookupService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);

	petId = signal<string | null>(null);

	// Form Signals
	kinds = signal<Kind[]>([]);
	genders = signal<Gender[]>([]);
	races = signal<Race[]>([]);

	// Form State
	petForm = {
		name: "",
		status: "LOST",
		kindId: "",
		raceId: "",
		genderId: "",
		ownerEmail: "",
	};

	// Media Signals
	mediaItems = signal<
		{
			preview: string;
			type: "image" | "video";
			file?: Blob; // optional, since existing media might not have a file Blob initially
			id?: string; // from backend for existing media
			location?: { lat: number; lng: number };
		}[]
	>([]);

	location = signal<{ lat: number; lng: number } | null>(null);
	locationText = signal<string>("Sin ubicación");

	isSaving = signal(false);
	isLoading = signal(true);

	constructor() {
		addIcons({
			cameraOutline,
			locationOutline,
			refreshOutline,
			closeOutline,
			pawOutline,
			trashOutline
		});
	}

	ngOnInit(): void {
		this.loadLookups();

		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.petId.set(id);
			this.loadPetData(id);
		} else {
			this.isLoading.set(false);
		}
	}

	async loadLookups() {
		this.lookupService.getKinds().subscribe({
			next: (kinds) => this.kinds.set(kinds),
		});
		this.lookupService.getGenders().subscribe({
			next: (genders) => this.genders.set(genders),
		});
	}

	loadPetData(id: string) {
		this.petService.getPetById(id).subscribe({
			next: (pet: any) => {
				this.petForm.name = pet.name;
				this.petForm.status = pet.status;
				this.petForm.kindId = pet.kindId;
				this.petForm.genderId = pet.genderId;
				this.petForm.raceId = pet.raceId || "";
				this.petForm.ownerEmail = pet.ownerEmail || "";

				// If there are media associated, load them
				if (pet.media && pet.media.length > 0) {
					const existingMedia = pet.media.map((m: any) => ({
						id: m.id,
						preview: m.url,
						type: (m.type === 'VIDEO' ? 'video' : 'image') as ('image' | 'video'),
						location: (m.latitude && m.longitude) ? { lat: m.latitude, lng: m.longitude } : undefined
					}));
					this.mediaItems.set(existingMedia);
				}

				// Load related races if kindId is known
				if (pet.kindId) {
					this.lookupService.getRaces(pet.kindId).subscribe((races) => {
						this.races.set(races);
						// Ensure raceId is kept after races load
						this.petForm.raceId = pet.raceId || "";
					});
				}

				this.isLoading.set(false);
			},
			error: (err) => {
				console.error("Error loading pet details:", err);
				this.isLoading.set(false);
				this.router.navigate(['/pets']);
			}
		});
	}

	onKindChange(event: any) {
		const kindId = event.target.value;
		this.petForm.raceId = ""; // Reset race when kind changes
		this.lookupService
			.getRaces(kindId)
			.subscribe((races) => this.races.set(races));
	}

	async captureMedia() {
		try {
			const image = await Camera.getPhoto({
				quality: 90,
				allowEditing: false,
				resultType: CameraResultType.Uri,
				source: CameraSource.Prompt,
				saveToGallery: true,
			});

			if (image.webPath) {
				const response = await fetch(image.webPath);
				const blob = await response.blob();

				let captureLocation = undefined;
				try {
					const coordinates = await Geolocation.getCurrentPosition();
					captureLocation = {
						lat: coordinates.coords.latitude,
						lng: coordinates.coords.longitude,
					};
					this.location.set(captureLocation);
					this.locationText.set(
						`${captureLocation.lat.toFixed(4)}, ${captureLocation.lng.toFixed(4)}`,
					);
				} catch (e) {
					console.warn("Location capture failed", e);
				}

				const newItem = {
					preview: image.webPath,
					type: "image" as const,
					file: blob,
					location: captureLocation,
				};

				this.mediaItems.set([...this.mediaItems(), newItem]);
			}
		} catch (error) {
			console.error("Camera capture failed", error);
		}
	}

	removeMedia(index: number) {
		const items = [...this.mediaItems()];
		items.splice(index, 1);
		this.mediaItems.set(items);

		if (items.length === 0) {
			this.location.set(null);
			this.locationText.set("Sin ubicación");
		}
	}

	async savePet() {
		if (!this.petForm.name || !this.petForm.kindId || !this.petForm.genderId) {
			return; // Required fields missing
		}

		const id = this.petId();
		if (!id) return;

		this.isSaving.set(true);

		this.petService
			.updatePet(id, {
				name: this.petForm.name,
				status: this.petForm.status,
				kindId: this.petForm.kindId,
				genderId: this.petForm.genderId,
				raceId: this.petForm.raceId || null,
				ownerEmail: this.petForm.ownerEmail || null,
			})
			.subscribe({
				next: async (res) => {
					// Upload only new media files
					if (id && this.mediaItems().length > 0) {
						try {
							for (const item of this.mediaItems()) {
								// If it has a blob/file and lacks an existing DB id, it is new
								if (item.file && !item.id) {
									await firstValueFrom(
										this.petService.uploadMedia(
											id,
											item.file as Blob,
											item.location?.lat,
											item.location?.lng
										)
									);
								}
							}
						} catch (mediaError) {
							console.error("Error uploading media", mediaError);
						}
					}

					this.isSaving.set(false);
					this.router.navigate(["/pets"]);
				},

				error: () => {
					this.isSaving.set(false);
				},
			});
	}

	cancel() {
		this.router.navigate(["/pets"]);
	}
}
