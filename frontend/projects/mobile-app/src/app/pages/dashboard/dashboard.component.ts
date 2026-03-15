import {
	Component,
	inject,
	OnInit,
	signal,
	CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
	IonContent,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonCard,
	IonCardContent,
	IonIcon,
	IonRefresher,
	IonRefresherContent,
	IonMenuButton,
	IonButtons,
} from "@ionic/angular/standalone";
import { AuthService, PetService, LookupService } from "shared-logic";
import { User, Pet, Shelter } from "shared-logic";
import { addIcons } from "ionicons";
import {
	pawOutline,
	businessOutline,
	alertCircleOutline,
	heartOutline,
	searchOutline,
	chevronForwardOutline,
	refreshOutline,
} from "ionicons/icons";

@Component({
	selector: "app-dashboard",
	standalone: true,
	imports: [
		CommonModule,
		IonContent,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonCard,
		IonCardContent,
		IonIcon,
		IonRefresher,
		IonRefresherContent,
		IonMenuButton,
		IonButtons,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./dashboard.component.html",
	styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
	private authService = inject(AuthService);
	private petService = inject(PetService);
	private lookupService = inject(LookupService);
	private router = inject(Router);

	user = signal<User | null>(null);
	pets = signal<Pet[]>([]);
	shelterCount = signal(0);
	isLoading = signal(true);

	// Computed stats
	lostCount = signal(0);
	adoptionCount = signal(0);
	foundCount = signal(0);

	constructor() {
		addIcons({
			pawOutline,
			businessOutline,
			alertCircleOutline,
			heartOutline,
			searchOutline,
			chevronForwardOutline,
			refreshOutline,
		});
	}

	ngOnInit(): void {
		this.user.set(this.authService.getCurrentUser());
		this.loadData();
	}

	loadData(): void {
		this.isLoading.set(true);

		this.petService.getPets().subscribe({
			next: (pets) => {
				this.pets.set(pets);
				this.lostCount.set(pets.filter((p) => p.status === "LOST").length);
				this.adoptionCount.set(
					pets.filter((p) => p.status === "ADOPTION").length,
				);
				this.foundCount.set(pets.filter((p) => p.status === "FOUND").length);
				this.isLoading.set(false);
			},
			error: () => this.isLoading.set(false),
		});

		this.lookupService.getShelters().subscribe({
			next: (shelters) => this.shelterCount.set(shelters.length),
			error: () => {},
		});
	}

	handleRefresh(event: any): void {
		this.loadData();
		setTimeout(() => event.target.complete(), 1000);
	}

	navigateTo(path: string): void {
		this.router.navigate([path]);
	}
}
