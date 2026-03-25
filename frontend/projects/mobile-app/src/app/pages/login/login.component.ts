import {
	Component,
	inject,
	signal,
	CUSTOM_ELEMENTS_SCHEMA,
	OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import {
	IonCard,
	IonCardContent,
	IonContent,
	IonIcon,
	IonSpinner,
	AlertController,
} from "@ionic/angular/standalone";
import { Router, RouterLink } from "@angular/router";
import { AuthService, LoginRequest } from "shared-logic";
import { HttpClient } from "@angular/common/http";
import {
	eye,
	eyeOff,
	paw,
	fingerPrintOutline,
	mailOutline,
	lockClosedOutline,
} from "ionicons/icons";
import { addIcons } from "ionicons";
import { environment } from "../../../environments/environment";
import { NativeBiometric } from "@capgo/capacitor-native-biometric";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterLink,
		IonContent,
		IonCard,
		IonCardContent,
		IonIcon,
		IonSpinner,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private authService = inject(AuthService);
	private http = inject(HttpClient);
	private alertCtrl = inject(AlertController);

	loginForm: FormGroup;
	isLoading = signal(false);
	errorMessage = signal<string | null>(null);
	showPassword = signal(false);
	isBiometricModalOpen = signal(false);
	canUseBiometrics = signal(false);

	constructor() {
		addIcons({
			eye,
			eyeOff,
			paw,
			fingerPrintOutline,
			mailOutline,
			lockClosedOutline,
		});

		this.loginForm = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(6)]],
		});
	}

	async ngOnInit() {
		await this.checkBiometricCredentials();
	}

	async checkBiometricCredentials() {
		try {
			const result = await NativeBiometric.isCredentialsSaved({
				server: "save-puppy",
			});
			this.canUseBiometrics.set(result.isSaved);
		} catch (error) {
			console.error("Error checking biometric credentials:", error);
			this.canUseBiometrics.set(false);
		}
	}

	get email() {
		return this.loginForm.get("email");
	}

	get password() {
		return this.loginForm.get("password");
	}

	togglePasswordVisibility(): void {
		this.showPassword.update((val) => !val);
	}

	async loginWithBiometrics() {
		try {
			// Check if biometrics are available
			const available = await NativeBiometric.isAvailable();
			if (!available.isAvailable) {
				return;
			}

			// Show custom modal
			this.isBiometricModalOpen.set(true);

			// Perform biometric verification
			await NativeBiometric.verifyIdentity({
				reason: "Inicia sesión en Save Puppy",
				title: "Autenticación",
				subtitle: "Usa tu huella o Face ID",
				description: "Coloca tu huella en el sensor para continuar",
			});

			// If verifyIdentity doesn't throw, it's successful
			// Retrieve credentials
			const credentials = await NativeBiometric.getCredentials({
				server: "save-puppy",
			});

			this.isBiometricModalOpen.set(false);

			if (credentials && credentials.username && credentials.password) {
				this.performLogin({
					email: credentials.username,
					password: credentials.password,
				});
			}
		} catch (error: any) {
			this.isBiometricModalOpen.set(false);
			console.error("Biometric error:", error);
		}
	}

	cancelBiometrics() {
		this.isBiometricModalOpen.set(false);
	}

	onSubmit(): void {
		if (this.loginForm.invalid) {
			this.errorMessage.set(
				"Por favor completa todos los campos correctamente",
			);
			return;
		}

		const loginRequest: LoginRequest = {
			email: this.loginForm.get("email")?.value,
			password: this.loginForm.get("password")?.value,
		};

		this.performLogin(loginRequest, true); // True to save credentials on success
	}

	private performLogin(loginRequest: LoginRequest, saveOnSuccess = false): void {
		this.isLoading.set(true);
		this.errorMessage.set(null);

		// Call backend API
		this.http
			.post<any>(`${environment.apiUrl}/auth/login`, loginRequest)
			.subscribe({
				next: async (response) => {
					if (response.token) {
						if (saveOnSuccess) {
							// Save credentials for future biometric login
							await NativeBiometric.setCredentials({
								username: loginRequest.email,
								password: loginRequest.password,
								server: "save-puppy",
							}).catch((err) =>
								console.error("Error saving credentials:", err),
							);
						}
						this.authService.setToken(response.token, response.user);
						this.router.navigate(["/dashboard"]);
					}
				},
				error: (error) => {
					this.isLoading.set(false);
					this.errorMessage.set(
						error.message.includes("401")
							? "Credenciales inválidas"
							: error.message || "Error al iniciar sesión",
					);
				},
				complete: () => {
					this.isLoading.set(false);
				},
			});
	}
}
