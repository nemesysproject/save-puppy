import { Injectable, signal } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { environment } from "../../environments/environment";

export interface PetNotification {
	type: string;
	message: string;
	pet: {
		id: string;
		name: string;
		status: string;
	};
	timestamp: Date;
}

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private socket: Socket | null = null;
	notifications = signal<PetNotification[]>([]);

	private readonly SOCKET_URL = environment.apiUrl.replace("/api", "");

	connect() {
		if (this.socket?.connected) return;

		this.socket = io(this.SOCKET_URL, {
			path: "/socket.io",
			transports: ["websocket", "polling"],
		});

		this.socket.on("connect", () => {
			console.log("Socket connected:", this.socket?.id);
		});

		this.socket.on("pet-reported", (data: PetNotification) => {
			console.log("New pet reported:", data);
			this.addNotification(data);
		});

		this.socket.on("disconnect", () => {
			console.log("Socket disconnected");
		});
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	private addNotification(notification: PetNotification) {
		const current = this.notifications();
		this.notifications.set([notification, ...current].slice(0, 10));
	}

	clearNotifications() {
		this.notifications.set([]);
	}
}
