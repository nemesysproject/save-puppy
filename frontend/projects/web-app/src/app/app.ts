import { Component, OnInit, OnDestroy, inject, effect } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
	NotificationService,
	PetNotification,
} from "./services/notification.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, CommonModule],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App implements OnInit, OnDestroy {
	title = "web-app";
	notificationService = inject(NotificationService);
	showToast = false;
	currentNotification: PetNotification | null = null;

	constructor() {
		effect(() => {
			const notifications = this.notificationService.notifications();
			if (notifications.length > 0) {
				this.showNotification(notifications[0]);
			}
		});
	}

	ngOnInit() {
		this.notificationService.connect();
	}

	ngOnDestroy() {
		this.notificationService.disconnect();
	}

	showNotification(notification: PetNotification) {
		this.currentNotification = notification;
		this.showToast = true;

		setTimeout(() => {
			this.showToast = false;
		}, 5000);
	}

	dismissToast() {
		this.showToast = false;
	}
}
