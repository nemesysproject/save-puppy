import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
	Pet,
	CreatePetRequest,
	UpdatePetRequest,
	CreatePetResponse,
	UpdatePetResponse,
	DeletePetResponse,
} from "../models/pet.model";
import { API_BASE_URL } from "./api.tokens";

@Injectable({
	providedIn: "root",
})
export class PetService {
	private http = inject(HttpClient);
	private readonly baseUrl = inject(API_BASE_URL);
	private readonly apiUrl = `${this.baseUrl}/pets`;

	getPets(): Observable<Pet[]> {
		return this.http.get<Pet[]>(this.apiUrl);
	}

	getPetById(id: string): Observable<Pet> {
		return this.http.get<Pet>(`${this.apiUrl}/${id}`);
	}

	createPet(request: CreatePetRequest): Observable<CreatePetResponse> {
		return this.http.post<CreatePetResponse>(this.apiUrl, request);
	}

	updatePet(
		id: string,
		request: UpdatePetRequest,
	): Observable<UpdatePetResponse> {
		return this.http.put<UpdatePetResponse>(`${this.apiUrl}/${id}`, request);
	}

	deletePet(id: string): Observable<DeletePetResponse> {
		return this.http.delete<DeletePetResponse>(`${this.apiUrl}/${id}`);
	}
}
