import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonBadge,
    IonRefresher, IonRefresherContent, IonSpinner
} from '@ionic/angular/standalone';
import { LookupService } from 'shared-logic';
import { Shelter } from 'shared-logic';
import { addIcons } from 'ionicons';
import {
    businessOutline, locationOutline, mailOutline, peopleOutline,
    refreshOutline
} from 'ionicons/icons';

@Component({
    selector: 'app-shelters',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
        IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonBadge,
        IonRefresher, IonRefresherContent, IonSpinner
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './shelters.component.html',
    styleUrl: './shelters.component.scss'
})
export class SheltersComponent implements OnInit {
    private lookupService = inject(LookupService);

    shelters = signal<Shelter[]>([]);
    isLoading = signal(true);

    constructor() {
        addIcons({ businessOutline, locationOutline, mailOutline, peopleOutline, refreshOutline });
    }

    ngOnInit(): void {
        this.loadShelters();
    }

    loadShelters(): void {
        this.isLoading.set(true);
        this.lookupService.getShelters().subscribe({
            next: (shelters) => {
                this.shelters.set(shelters);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    handleRefresh(event: any): void {
        this.loadShelters();
        setTimeout(() => event.target.complete(), 1000);
    }

    openEmail(email: string): void {
        window.open(`mailto:${email}`, '_system');
    }
}