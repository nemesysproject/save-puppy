import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import {
	HttpClient,
	HttpClientModule,
	HttpHeaders,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "shared-logic";
import { environment } from "../../../../environments/environment";

@Component({
	selector: "app-create-shelter",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
	templateUrl: "./create-shelter.component.html",
	styleUrl: "./create-shelter.component.scss",
})
export class CreateShelterComponent {
	private fb = inject(FormBuilder);
	private http = inject(HttpClient);
	private router = inject(Router);
	private auth = inject(AuthService);

	isSubmitting = signal(false);
	error = signal<string | null>(null);

	form = this.fb.group({
		name: ["", [Validators.required]],
		email: ["", [Validators.required, Validators.email]],
		address: [""],
		latitude: [null],
		longitude: [null],
		capacity: [null],
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.isSubmitting.set(true);
		this.error.set(null);

		const token = this.auth.getBearerToken();
		const headers = token
			? new HttpHeaders({ Authorization: token })
			: new HttpHeaders();

		const payload = this.form.value;

		this.http
			.post(`${environment.apiUrl}/api/shelters`, payload, { headers })
			.subscribe({
				next: () => {
					this.router.navigate(["/shelters"]);
				},
				error: (err) => {
					this.error.set(err?.error?.message || "Error creando refugio");
					this.isSubmitting.set(false);
				},
			});
	}

	cancel(): void {
		this.router.navigate(["/shelters"]);
	}
}
