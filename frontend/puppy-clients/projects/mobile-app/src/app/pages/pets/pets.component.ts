import { Component, inject, OnInit, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonBadge,
    IonChip, IonLabel, IonRefresher, IonRefresherContent, IonSpinner,
    IonSearchbar
} from '@ionic/angular/standalone';
import { PetService } from 'shared-logic';
import { Pet } from 'shared-logic';
import { addIcons } from 'ionicons';
import {
    pawOutline, alertCircleOutline, heartOutline, searchOutline,
    refreshOutline, maleOutline, femaleOutline
} from 'ionicons/icons';

type PetStatus = 'ALL' | 'LOST' | 'ADOPTION' | 'FOUND';

@Component({
    selector: 'app-pets',
    standalone: true,
    imports: [
        CommonModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader,
        IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonBadge,
        IonChip, IonLabel, IonRefresher, IonRefresherContent, IonSpinner,
        IonSearchbar
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './pets.component.html',
    styleUrl: './pets.component.scss'
})
export class PetsComponent implements OnInit {
    private petService = inject(PetService);

    allPets = signal<Pet[]>([]);
    activeFilter = signal<PetStatus>('ALL');
    searchQuery = signal('');
    isLoading = signal(true);

    filteredPets = computed(() => {
        let pets = this.allPets();
        const filter = this.activeFilter();
        const query = this.searchQuery().toLowerCase();

        if (filter !== 'ALL') {
            pets = pets.filter(p => p.status === filter);
        }
        if (query) {
            pets = pets.filter(p => p.name.toLowerCase().includes(query));
        }
        return pets;
    });

    constructor() {
        addIcons({
            pawOutline, alertCircleOutline, heartOutline, searchOutline,
            refreshOutline, maleOutline, femaleOutline
        });
    }

    ngOnInit(): void {
        this.loadPets();
    }

    loadPets(): void {
        this.isLoading.set(true);
        this.petService.getPets().subscribe({
            next: (pets) => {
                this.allPets.set(pets);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    setFilter(status: PetStatus): void {
        this.activeFilter.set(status);
    }

    onSearch(event: any): void {
        this.searchQuery.set(event.detail.value || '');
    }

    handleRefresh(event: any): void {
        this.loadPets();
        setTimeout(() => event.target.complete(), 1000);
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'LOST': return 'Perdido';
            case 'ADOPTION': return 'En adopción';
            case 'FOUND': return 'Encontrado';
            default: return status;
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'LOST': return 'danger';
            case 'ADOPTION': return 'tertiary';
            case 'FOUND': return 'success';
            default: return 'medium';
        }
    }
}
