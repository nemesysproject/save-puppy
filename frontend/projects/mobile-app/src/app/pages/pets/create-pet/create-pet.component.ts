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
import { Router } from "@angular/router";

@Component({
	selector: "app-create-pet",
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
	templateUrl: "./create-pet.component.html",
	styleUrl: "./create-pet.component.scss",
})
export class CreatePetComponent implements OnInit {
	private petService = inject(PetService);
	private lookupService = inject(LookupService);
	private router = inject(Router);

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
		ownerEmail: "", // Will be populated from auth if available
	};

	// Media Signals
	mediaItems = signal<
		{
			preview: string;
			type: "image" | "video";
			file: Blob;
			location?: { lat: number; lng: number };
		}[]
	>([]);

	// Location Signal for the current/last capture
	location = signal<{ lat: number; lng: number } | null>(null);
	locationText = signal<string>("Sin ubicación");

	isSaving = signal(false);

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
	}

	async loadLookups() {
		this.lookupService.getKinds().subscribe({
			next: (kinds) => {
				this.kinds.set(kinds);
			},
			error: (err) => { },
		});
		this.lookupService.getGenders().subscribe({
			next: (genders) => {
				this.genders.set(genders);
			},
			error: (err) => { },
		});
	}

	onKindChange(event: any) {
		const kindId = event.target.value;
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

				// Get location for this specific capture
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
			// Add toast or alert here
			return;
		}

		this.isSaving.set(true);

		// 1. Create Pet
		this.petService
			.createPet({
				name: this.petForm.name,
				status: this.petForm.status,
				kindId: this.petForm.kindId,
				genderId: this.petForm.genderId,
				raceId: this.petForm.raceId || undefined,
				ownerEmail: this.petForm.ownerEmail || null,
			})
			.subscribe({
				next: async (res) => {
					// 2. Upload media sequentially for the newly created pet
					const createdPetId = res.id || res.pet?.id;

					if (createdPetId && this.mediaItems().length > 0) {
						try {
							for (const item of this.mediaItems()) {
								if (item.file) {
									await firstValueFrom(
										this.petService.uploadMedia(
											createdPetId,
											item.file,
											item.location?.lat,
											item.location?.lng
										)
									);
								}
							}
						} catch (mediaError) {
							console.error("Error uploading media", mediaError);
							// Still redirecting since pet exists, but might show partial error.
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
