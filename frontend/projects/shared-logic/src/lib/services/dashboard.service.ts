import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_BASE_URL } from "./api.tokens";

export interface DashboardStats {
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

@Injectable({
	providedIn: "root",
})
export class DashboardService {
	private http = inject(HttpClient);
	private readonly baseUrl = inject(API_BASE_URL);
	private readonly apiUrl = `${this.baseUrl}/dashboard`;

	getStats(): Observable<DashboardStats> {
		return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
	}
}
