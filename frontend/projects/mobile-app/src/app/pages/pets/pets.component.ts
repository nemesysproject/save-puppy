import {
	Component,
	inject,
	OnInit,
	signal,
	CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonLabel,
	IonIcon,
	IonBadge,
	IonRefresher,
	IonRefresherContent,
	IonMenuButton,
	IonButtons,
	IonModal,
	IonFab,
	IonFabButton,
	IonBackButton,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonCardContent,
	IonList,
	IonItem,
	IonThumbnail,
	IonSearchbar,
	IonChip,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { add } from "ionicons/icons";
import {
	pawOutline,
	alertCircleOutline,
	heartOutline,
	searchOutline,
	refreshOutline,
	locationOutline,
	imageOutline,
	closeOutline,
	addOutline,
	createOutline,
	trashOutline,
} from "ionicons/icons";
import { HttpClient } from "@angular/common/http";
import { API_BASE_URL, PetService, Pet } from "shared-logic";
import { Router } from "@angular/router";
import { Geolocation } from "@capacitor/geolocation";

// interface PetWithMedia handled by the shared Pet model now
type PetWithMedia = Pet & { distance?: number };

type DistanceOption = 1 | 5 | 10;

@Component({
	selector: "app-pets",
	standalone: true,
	imports: [
		CommonModule,
		IonContent,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonIcon,
		IonBadge,
		IonRefresher,
		IonRefresherContent,
		IonLabel,
		IonMenuButton,
		IonButtons,
		IonFab,
		IonFabButton,
		IonBackButton,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
		IonList,
		IonItem,
		IonThumbnail,
		IonSearchbar,
		IonChip,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./pets.component.html",
	styleUrl: "./pets.component.scss",
})
export class PetsComponent implements OnInit {
	private http = inject(HttpClient);
	private petService = inject(PetService);
	private baseUrl = inject(API_BASE_URL);
	private router = inject(Router);

	pets = signal<PetWithMedia[]>([]);
	filteredPets = signal<PetWithMedia[]>([]);
	isLoading = signal(true);
	distance = signal<DistanceOption>(5);
	showOptionsModal = signal(false);
	includeImages = signal(true);
	hasMore = signal(true);


	activeFilter = signal<string>("ALL");
	searchQuery = signal<string>("");

	// Ubicación real del usuario (se obtiene al iniciar)
	userLat = 0;
	userLon = 0;
	locationReady = signal(false);

	constructor() {
		addIcons({
			add,
			pawOutline,
			alertCircleOutline,
			heartOutline,
			searchOutline,
			refreshOutline,
			locationOutline,
			imageOutline,
			closeOutline,
			addOutline,
			createOutline,
			trashOutline,
		});
	}

	goToCreatePet(): void {
		this.router.navigate(["/pets/create"]);
	}

	async ngOnInit(): Promise<void> {
		try {
			const position = await Geolocation.getCurrentPosition();
			this.userLat = position.coords.latitude;
			this.userLon = position.coords.longitude;
			this.locationReady.set(true);
			console.log(`[Pets] User location: ${this.userLat}, ${this.userLon}`);
		} catch (e) {
			console.warn("[Pets] Could not get location, using defaults", e);
			// Fallback a una ubicación por defecto si no se puede obtener
			this.userLat = 19.4326;
			this.userLon = -99.1332;
			this.locationReady.set(true);
		}
		this.loadPets();
	}

	loadPets(event?: any): void {
		if (!event) {
			this.isLoading.set(true);
		}

		console.log("Loading pets", {
			lat: this.userLat,
			lon: this.userLon,
			radius: this.distance(),
		});

		// Use the PetService to fetch real data
		this.petService
			.searchPets({
				lat: this.userLat,
				lon: this.userLon,
				radius: this.distance(),
			})
			.subscribe({
				next: (pets: any[]) => {
					console.log("Pets loaded", pets);
					if (!event) {
						this.isLoading.set(false);
					}
					// The user requested to limit the response to 3 pets
					const limitedPets = pets.slice(0, 3);
					this.pets.set(limitedPets);
					this.applyFilters();
					if (event) {
						event.target.complete();
					}
				},
				error: (err) => {
					console.error("Error loading pets", err);
					if (!event) {
						this.isLoading.set(false);
					}
					if (event) {
						event.target.complete();
					}
				},
			});
	}

	loadMore(event: any): void {
		let result = this.pets();

		const filter = this.activeFilter();
		if (filter !== "ALL") {
			result = result.filter((pet) => pet.status === filter);
		}

		const query = this.searchQuery();
		if (query) {
			result = result.filter(
				(pet) =>
					pet.name.toLowerCase().includes(query) ||
					(pet.kind?.name?.toLowerCase() || "").includes(query) ||
					(pet.race?.name?.toLowerCase() || "").includes(query),
			);
		}

		const current = this.filteredPets().length;
		const next = result.slice(current, current + 10);

		if (next.length > 0) {
			this.filteredPets.set([...this.filteredPets(), ...next]);
		}

		this.hasMore.set(next.length === 10);

		setTimeout(() => event.target.complete(), 500);

	}

	setFilter(filter: string): void {
		this.activeFilter.set(filter);
		this.applyFilters();
	}

	onSearch(event: any): void {
		const query = (event.target as any).value?.toLowerCase() || "";
		this.searchQuery.set(query);
		this.applyFilters();
	}

	applyFilters(): void {
		let result = this.pets();

		const filter = this.activeFilter();
		if (filter !== "ALL") {
			result = result.filter((pet) => pet.status === filter);
		}

		const query = this.searchQuery();
		if (query) {
			result = result.filter(
				(pet) =>
					pet.name.toLowerCase().includes(query) ||
					(pet.kind?.name?.toLowerCase() || "").includes(query) ||
					(pet.race?.name?.toLowerCase() || "").includes(query),
			);
		}

		this.filteredPets.set(result.slice(0, 10));
		this.hasMore.set(result.length > 10);
	}

	setDistance(dist: DistanceOption): void {
		console.log("Setting distance filter to", dist);
		this.distance.set(dist);
		this.showOptionsModal.set(false);
		this.loadPets();
	}

	toggleImageFilter(): void {
		this.includeImages.set(!this.includeImages());
		this.showOptionsModal.set(false);
		this.loadPets();
	}

	getStatusLabel(status: string): string {
		switch (status) {
			case "LOST":
				return "Perdido";
			case "ADOPTION":
				return "En adopción";
			case "FOUND":
				return "Encontrado";
			default:
				return status;
		}
	}

	getStatusColor(status: string): string {
		return status === "LOST" ? "danger" : "warning";
	}

	formatDate(date: Date | string): string {
		const d = new Date(date);
		return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
	}

	formatDistance(dist?: number): string {
		if (!dist) return "";
		return `${dist.toFixed(1)} km`;
	}

	handleRefresh(event: any): void {
		this.loadPets(event);
	}

	editPet(pet: PetWithMedia): void {
		this.router.navigate(["/pets/edit", pet.id]);
	}

	deletePet(pet: PetWithMedia, index: number): void {
		if (confirm(`¿Estás seguro de eliminar a ${pet.name}?`)) {
			this.petService.deletePet(pet.id).subscribe({
				next: () => {
					const updatedPets = this.pets().filter((p) => p.id !== pet.id);
					this.pets.set(updatedPets);
					this.applyFilters();
				},
				error: (err) => console.error("Error deleting pet", err),
			});
		}
	}
}
