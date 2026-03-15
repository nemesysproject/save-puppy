import {
	Component,
	inject,
	signal,
	CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from "@angular/forms";
import {
	IonContent,
	IonCard,
	IonCardContent,
	IonIcon,
	IonSpinner,
	IonText,
} from "@ionic/angular/standalone";
import { Router, RouterLink } from "@angular/router";
import { AuthService, RegisterRequest } from "shared-logic";
import { HttpClient } from "@angular/common/http";
import {
	eye,
	eyeOff,
	arrowBackOutline,
	logoGoogle,
	logoFacebook,
} from "ionicons/icons";
import { addIcons } from "ionicons";
import { environment } from "../../../environments/environment";

@Component({
	selector: "app-register",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterLink,
		IonContent,
		IonCard,
		IonCardContent,
		IonText,
		IonIcon,
		IonSpinner,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
})
export class RegisterComponent {
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private authService = inject(AuthService);
	private http = inject(HttpClient);

	registerForm: FormGroup;
	isLoading = signal(false);
	errorMessage = signal<string | null>(null);
	successMessage = signal<string | null>(null);
	showPassword = signal(false);
	showConfirmPassword = signal(false);

	constructor() {
		addIcons({ eye, eyeOff, arrowBackOutline, logoGoogle, logoFacebook });

		this.registerForm = this.fb.group(
			{
				email: ["", [Validators.required, Validators.email]],
				password: ["", [Validators.required, Validators.minLength(6)]],
				confirmPassword: ["", [Validators.required]],
			},
			{ validators: this.passwordsMatch },
		);
	}

	get email() {
		return this.registerForm.get("email");
	}
	get password() {
		return this.registerForm.get("password");
	}
	get confirmPassword() {
		return this.registerForm.get("confirmPassword");
	}

	passwordsMatch(group: AbstractControl): ValidationErrors | null {
		const password = group.get("password")?.value;
		const confirmPassword = group.get("confirmPassword")?.value;
		return password === confirmPassword ? null : { passwordsMismatch: true };
	}

	togglePasswordVisibility(): void {
		this.showPassword.update((v) => !v);
	}

	toggleConfirmPasswordVisibility(): void {
		this.showConfirmPassword.update((v) => !v);
	}

	onSubmit(): void {
		if (this.registerForm.invalid) {
			this.errorMessage.set(
				"Por favor completa todos los campos correctamente",
			);
			return;
		}

		this.isLoading.set(true);
		this.errorMessage.set(null);
		this.successMessage.set(null);

		const request: RegisterRequest = {
			email: this.registerForm.get("email")?.value,
			password: this.registerForm.get("password")?.value,
			confirmPassword: this.registerForm.get("confirmPassword")?.value,
		};

		this.http
			.post<any>(`${environment.apiUrl}/api/auth/register`, request)
			.subscribe({
				next: (response) => {
					this.isLoading.set(false);
					this.successMessage.set(
						response.message || "¡Cuenta creada exitosamente!",
					);
					setTimeout(() => this.router.navigate(["/login"]), 2000);
				},
				error: (error) => {
					this.isLoading.set(false);
					this.errorMessage.set(
						error.error?.message || "Error al registrarse. Intenta de nuevo.",
					);
				},
			});
	}

	registerWithGoogle(): void {
		this.isLoading.set(true);
		this.errorMessage.set(null);

		this.http.get<any>(`${environment.apiUrl}/api/auth/google`).subscribe({
			next: (response) => {
				if (response.url) {
					window.location.href = response.url;
				}
			},
			error: (error) => {
				this.isLoading.set(false);
				this.errorMessage.set(
					error.error?.message ||
						"Error al conectar con Google. Intenta de nuevo.",
				);
			},
		});
	}

	registerWithFacebook(): void {
		this.isLoading.set(true);
		this.errorMessage.set(null);

		this.http.get<any>(`${environment.apiUrl}/api/auth/facebook`).subscribe({
			next: (response) => {
				if (response.url) {
					window.location.href = response.url;
				}
			},
			error: (error) => {
				this.isLoading.set(false);
				this.errorMessage.set(
					error.error?.message ||
						"Error al conectar con Facebook. Intenta de nuevo.",
				);
			},
		});
	}
}
