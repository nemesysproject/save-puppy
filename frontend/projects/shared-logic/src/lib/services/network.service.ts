import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private _isConnected = new BehaviorSubject<boolean>(true);
  public isConnected$ = this._isConnected.asObservable();

  constructor(private toastController: ToastController) {
    this.initNetworkMonitoring();
  }

  private async initNetworkMonitoring() {
    const status = await Network.getStatus();
    this._isConnected.next(status.connected);

    Network.addListener('networkStatusChange', status => {
      const wasConnected = this._isConnected.value;
      const isConnected = status.connected;

      if (wasConnected !== isConnected) {
        this._isConnected.next(isConnected);
        this.showNotification(isConnected);
      }
    });
  }

  private async showNotification(isConnected: boolean) {
    const toast = await this.toastController.create({
      message: isConnected ? 'Conexión restablecida 🟢' : 'Estás trabajando sin conexión 🔴',
      duration: 3000,
      position: 'bottom',
      color: isConnected ? 'success' : 'warning',
      icon: isConnected ? 'wifi' : 'cloud-offline'
    });
    await toast.present();
  }
}