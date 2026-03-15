import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService, RegisterRequest } from "shared-logic";

@Component({
	selector: "app-register",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
})
export class RegisterComponent {
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private authService = inject(AuthService);

	registerForm: FormGroup;
	isLoading = signal(false);
	errorMessage = signal<string | null>(null);
	successMessage = signal<string | null>(null);
	showPassword = signal(false);
	showConfirmPassword = signal(false);

	constructor() {
		this.registerForm = this.fb.group(
			{
				email: ["", [Validators.required, Validators.email]],
				password: ["", [Validators.required, Validators.minLength(6)]],
				confirmPassword: ["", [Validators.required]],
			},
			{ validators: this.passwordMatchValidator },
		);
	}

	passwordMatchValidator(g: FormGroup) {
		return g.get("password")?.value === g.get("confirmPassword")?.value
			? null
			: { mismatch: true };
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

	togglePasswordVisibility(): void {
		this.showPassword.update((val) => !val);
	}

	toggleConfirmPasswordVisibility(): void {
		this.showConfirmPassword.update((val) => !val);
	}

	onSubmit(): void {
		if (this.registerForm.invalid) {
			if (this.registerForm.errors?.["mismatch"]) {
				this.errorMessage.set("Las contraseñas no coinciden");
			} else {
				this.errorMessage.set(
					"Por favor completa todos los campos correctamente",
				);
			}
			return;
		}

		this.isLoading.set(true);
		this.errorMessage.set(null);
		this.successMessage.set(null);

		const registerRequest: RegisterRequest = {
			email: this.registerForm.get("email")?.value,
			password: this.registerForm.get("password")?.value,
		};

		this.authService.register(registerRequest).subscribe({
			next: (response: any) => {
				this.successMessage.set("¡Usuario registrado exitosamente!");
				setTimeout(() => {
					this.router.navigate(["/login"]);
				}, 2000);
			},
			error: (error: any) => {
				this.isLoading.set(false);
				this.errorMessage.set(
					error.error?.error ||
						error.error?.message ||
						"Error al registrar usuario. Intenta de nuevo.",
				);
			},
			complete: () => {
				this.isLoading.set(false);
			},
		});
	}
}
