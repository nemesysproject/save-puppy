import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from './socket.service';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationUiService {

  constructor(
    private socketService: SocketService,
    private snackBar: MatSnackBar
  ) {
    this.initializeListener();
  }

  /**
   * Escucha globalmente el evento 'notification' del socket
   */
  private initializeListener(): void {
    this.socketService.on<NotificationPayload>('notification').subscribe(notification => {
      this.showSnackbar(notification);
    });
  }

  private showSnackbar(notification: NotificationPayload): void {
    const message = `${notification.title}: ${notification.body}`;
    
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000, // 5 segundos
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['puppy-notification-success'] // Clase CSS personalizada
    });
  }
}