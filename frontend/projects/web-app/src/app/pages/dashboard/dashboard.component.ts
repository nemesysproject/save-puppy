import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { API_BASE_URL } from "shared-logic";

interface DashboardStats {
	totalPets: number;
	totalShelters: number;
	totalUsers: number;
	totalAdoptions: number;
	petsByStatus: {
		lost: number;
		adoption: number;
		found: number;
	};
	adoptionsByStatus: {
		pending: number;
		approved: number;
		rejected: number;
	};
}

@Component({
	selector: "app-dashboard",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./dashboard.component.html",
	styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
	private http = inject(HttpClient);
	private baseUrl = inject(API_BASE_URL);

	stats = signal<DashboardStats | null>(null);
	isLoading = signal<boolean>(true);
	error = signal<string | null>(null);

	ngOnInit() {
		this.loadStats();
	}

	loadStats() {
		this.isLoading.set(true);
		this.error.set(null);

		this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`).subscribe({
			next: (data: DashboardStats) => {
				this.stats.set(data);
				this.isLoading.set(false);
			},
			error: (err: any) => {
				this.error.set("Error al cargar las estadísticas");
				this.isLoading.set(false);
				console.error("Dashboard stats error:", err);
			},
		});
	}
}
