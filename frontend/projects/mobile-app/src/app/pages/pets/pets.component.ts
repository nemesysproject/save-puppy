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
} from "ionicons/icons";
import { HttpClient } from "@angular/common/http";
import { API_BASE_URL } from "shared-logic";
import { Router } from "@angular/router";

interface PetWithMedia {
	id: string;
	name: string;
	status: string;
	kindId: string;
	genderId: string;
	shelterId: string | null;
	ownerEmail: string | null;
	createdAt: Date;
	kind?: { name: string };
	gender?: { name: string };
	race?: { name: string } | null;
	media?: { url: string; latitude: number | null; longitude: number | null }[];
	distance?: number;
}

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
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./pets.component.html",
	styleUrl: "./pets.component.scss",
})
export class PetsComponent implements OnInit {
	private http = inject(HttpClient);
	private baseUrl = inject(API_BASE_URL);
	private router = inject(Router);

	pets = signal<PetWithMedia[]>([]);
	filteredPets = signal<PetWithMedia[]>([]);
	isLoading = signal(true);
	distance = signal<DistanceOption>(5);
	showOptionsModal = signal(false);
	includeImages = signal(true);

	activeFilter = signal<string>("ALL");
	searchQuery = signal<string>("");

	// Demo location (should be replaced with real geolocation)
	userLat = 19.4326;
	userLon = -99.1332;

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
		});
	}

	goToCreatePet(): void {
		this.router.navigate(["/pets/create"]);
	}

	ngOnInit(): void {
		this.loadPets();
	}

	loadPets(): void {
		this.isLoading.set(true);

		const url = `${this.baseUrl}/pets/search?lat=${this.userLat}&lon=${this.userLon}&radius=${this.distance()}&status=LOST,ADOPTION&withImages=${this.includeImages()}`;

		this.http.get<PetWithMedia[]>(url).subscribe({
			next: (pets) => {
				console.log("pets", pets);
				this.isLoading.set(false);
				this.pets.set(pets);
				this.applyFilters();
			},
			error: (error) => {
				console.error("error", error);
				this.isLoading.set(false);
				console.log("isLoading", this.isLoading());
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
	}

	setDistance(dist: DistanceOption): void {
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
		this.loadPets();
		setTimeout(() => event.target.complete(), 1000);
	}
}
