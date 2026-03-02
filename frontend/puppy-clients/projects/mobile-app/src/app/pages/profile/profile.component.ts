import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonIcon, IonButton, IonLabel, IonItem,
    IonList, IonAvatar
} from '@ionic/angular/standalone';
import { AuthService } from 'shared-logic';
import { User } from 'shared-logic';
import { addIcons } from 'ionicons';
import {
    personCircleOutline, mailOutline, shieldCheckmarkOutline,
    logOutOutline, informationCircleOutline, chevronForwardOutline
} from 'ionicons/icons';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
        IonCardTitle, IonCardContent, IonIcon, IonButton, IonLabel, IonItem,
        IonList, IonAvatar
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    user = signal<User | null>(null);

    constructor() {
        addIcons({
            personCircleOutline, mailOutline, shieldCheckmarkOutline,
            logOutOutline, informationCircleOutline, chevronForwardOutline
        });
    }

    ngOnInit(): void {
        this.user.set(this.authService.getCurrentUser());
    }

    logout(): void {
        this.authService.clearToken();
        this.router.navigate(['/login']);
    }

    getRoleLabel(role: string): string {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'user': return 'Usuario';
            default: return role;
        }
    }
}
