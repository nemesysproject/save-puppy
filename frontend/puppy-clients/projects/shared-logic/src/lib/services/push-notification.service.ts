import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../shared-logic/src/lib/services/auth.service';
import { API_BASE_URL } from './api.tokens';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private _fcmToken = new BehaviorSubject<string | null>(null);
  public fcmToken$ = this._fcmToken.asObservable();

  // URL del Backend (Debería venir de environment.ts en producción)
  private readonly apiUrl = inject(API_BASE_URL);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private async registerPush() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.error('Permiso de notificaciones denegado');
      return;
    }

    await PushNotifications.register();

    this.addListeners();
  }

  private addListeners() {
    // Éxito al registrar
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      this._fcmToken.next(token.value);
      this.registerTokenOnServer(token.value);
    });

    // Error al registrar
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Notificación recibida en primer plano
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Acción realizada (click en notificación)
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        // Aquí puedes implementar la navegación profunda (Deep Linking)
      }
    );
  }

  private registerTokenOnServer(token: string) {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Endpoint para guardar el token FCM asociado al usuario
      this.http.post(`${this.apiUrl}/users/device-token`, { token })
        .subscribe({
          next: () => console.log('Token FCM registrado en backend'),
          error: (err) => console.error('Error registrando token en backend', err)
        });
    }
  }
}