import { Component, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SheltersTableComponent } from "./shelters-table/shelters-table.component";
import {
	HttpClientModule,
	HttpClient,
	HttpHeaders,
} from "@angular/common/http";
import { Shelter } from "shared-logic";
import { environment } from "../../../environments/environment";
import { AuthService } from "shared-logic";
import { Router } from "@angular/router";

@Component({
	selector: "app-shelters",
	standalone: true,
	imports: [CommonModule, HttpClientModule, RouterLink, SheltersTableComponent],
	templateUrl: "./shelters.component.html",
	styleUrl: "./shelters.component.scss",
})
export class SheltersComponent {
	private http = inject(HttpClient);
	private auth = inject(AuthService);

	shelters = signal<Shelter[] | null>(null);
	isLoading = signal(false);
	error = signal<string | null>(null);
	search = signal("");

	filtered = computed(() => {
		const list = this.shelters() || [];
		console.log("Shelters list:", list);
		const q = this.search().trim().toLowerCase();
		console.log("Search query:", q);
		if (!q) {
			console.log("No search query, returning all shelters", this.shelters());
			return list;
		}
		return list.filter(
			(s) =>
				(s.name || "").toLowerCase().includes(q) ||
				(s.email || "").toLowerCase().includes(q) ||
				(s.address || "").toLowerCase().includes(q),
		);
	});

	private router = inject(Router);

	constructor() {
		this.loadShelters();
	}

	private loadShelters(): void {
		this.isLoading.set(true);
		this.error.set(null);

		const token = this.auth.getBearerToken();
		const headers = token
			? new HttpHeaders({ Authorization: token })
			: new HttpHeaders();

		this.http
			.get<Shelter[]>(`${environment.apiUrl}/shelters`, { headers })
			.subscribe({
				next: (res) => {
					console.log("Shelters response:", res);
					this.shelters.set(res ?? []);
				},
				error: (err) => {
					this.error.set(err?.error?.message || "Error cargando refugios");
				},
				complete: () => this.isLoading.set(false),
			});
	}

	createShelter(): void {
		this.router.navigate(["/shelters/create"]);
	}
}
