import {
	Component,
	inject,
	signal,
	CUSTOM_ELEMENTS_SCHEMA,
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
export class LoginComponent {
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private authService = inject(AuthService);
	private http = inject(HttpClient);
	private alertCtrl = inject(AlertController);

	loginForm: FormGroup;
	isLoading = signal(false);
	errorMessage = signal<string | null>(null);
	showPassword = signal(false);

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
		const alert = await this.alertCtrl.create({
			header: "Autenticación Biométrica",
			message: "Usa Face ID o Huella Digital para iniciar sesión rápidamente.",
			buttons: [
				{
					text: "Cancelar",
					role: "cancel",
				},
				{
					text: "Autenticar",
					handler: () => {
						this.isLoading.set(true);
						setTimeout(() => {
							this.isLoading.set(false);
							this.authService.setToken("mock-biometric-token", {
								id: "biometric-mock",
								email: "bio@savepuppy.com",
								role: "USER",
								provider: "BIOMETRICS",
							});
							this.router.navigate(["/dashboard"]);
						}, 1000);
					},
				},
			],
		});
		await alert.present();
	}

	onSubmit(): void {
		if (this.loginForm.invalid) {
			this.errorMessage.set(
				"Por favor completa todos los campos correctamente",
			);
			return;
		}

		this.isLoading.set(true);
		this.errorMessage.set(null);

		const loginRequest: LoginRequest = {
			email: this.loginForm.get("email")?.value,
			password: this.loginForm.get("password")?.value,
		};

		// Call backend API
		this.http
			.post<any>(`${environment.apiUrl}/auth/login`, loginRequest)
			.subscribe({
				next: (response) => {
					if (response.token) {
						this.authService.setToken(response.token, response.user);
						this.router.navigate(["/dashboard"]);
					}
				},
				error: (error) => {
					this.isLoading.set(false);
					this.errorMessage.set(
						error.message.includes("401") || error.message, //'Error al iniciar sesión. Intenta de nuevo.'
					);
				},
				complete: () => {
					this.isLoading.set(false);
				},
			});
	}
}
