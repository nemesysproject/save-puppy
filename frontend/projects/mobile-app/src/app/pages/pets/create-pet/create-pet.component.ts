import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonButton, IonIcon, IonItem, IonLabel, IonInput, IonChip, IonSpinner, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, locationOutline, refreshOutline, closeOutline, pawOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PetService, LookupService, Kind, Gender, Race } from 'shared-logic';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-pet',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
        IonButton, IonIcon, IonItem, IonLabel, IonInput,
        IonChip, IonSpinner
    ],
    templateUrl: './create-pet.component.html',
    styleUrl: './create-pet.component.scss'
})
export class CreatePetComponent implements OnInit {
    private petService = inject(PetService);
    private lookupService = inject(LookupService);
    private router = inject(Router);

    // Form Signals
    kinds = signal<Kind[]>([]);
    genders = signal<Gender[]>([]);
    races = signal<Race[]>([]);

    // Form State
    petForm = {
        name: '',
        status: 'LOST',
        kindId: '',
        raceId: '',
        genderId: '',
        ownerEmail: '' // Will be populated from auth if available
    };

    // Media Signals
    mediaItems = signal<{ preview: string; type: 'image' | 'video'; file: Blob; location?: { lat: number; lng: number } }[]>([]);

    // Location Signal for the current/last capture
    location = signal<{ lat: number; lng: number } | null>(null);
    locationText = signal<string>('Sin ubicación');

    isSaving = signal(false);

    constructor() {
        addIcons({ cameraOutline, locationOutline, refreshOutline, closeOutline, pawOutline });
    }

    ngOnInit(): void {
        this.loadLookups();
    }

    async loadLookups() {
        console.log('Loading lookups from:', (this.lookupService as any).baseUrl);
        this.lookupService.getKinds().subscribe({
            next: kinds => {
                console.log('Kinds loaded:', kinds);
                this.kinds.set(kinds);
            },
            error: err => console.error('Failed to load kinds', err)
        });
        this.lookupService.getGenders().subscribe({
            next: genders => {
                console.log('Genders loaded:', genders);
                this.genders.set(genders);
            },
            error: err => console.error('Failed to load genders', err)
        });
    }

    onKindChange(event: any) {
        const kindId = event.target.value;
        this.lookupService.getRaces(kindId).subscribe(races => this.races.set(races));
    }

    async captureMedia() {
        console.log('Requesting camera photo...');
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt,
                saveToGallery: true
            });

            if (image.webPath) {
                const response = await fetch(image.webPath);
                const blob = await response.blob();

                // Get location for this specific capture
                let captureLocation = undefined;
                try {
                    const coordinates = await Geolocation.getCurrentPosition();
                    captureLocation = {
                        lat: coordinates.coords.latitude,
                        lng: coordinates.coords.longitude
                    };
                    this.location.set(captureLocation);
                    this.locationText.set(`${captureLocation.lat.toFixed(4)}, ${captureLocation.lng.toFixed(4)}`);
                } catch (e) {
                    console.warn('Location capture failed', e);
                }

                const newItem = {
                    preview: image.webPath,
                    type: 'image' as const,
                    file: blob,
                    location: captureLocation
                };

                this.mediaItems.set([...this.mediaItems(), newItem]);
            }
        } catch (error) {
            console.error('Camera capture failed', error);
        }
    }

    removeMedia(index: number) {
        const items = [...this.mediaItems()];
        items.splice(index, 1);
        this.mediaItems.set(items);

        if (items.length === 0) {
            this.location.set(null);
            this.locationText.set('Sin ubicación');
        }
    }

    async savePet() {
        if (!this.petForm.name || !this.petForm.kindId || !this.petForm.genderId) {
            // Add toast or alert here
            return;
        }

        this.isSaving.set(true);

        // 1. Create Pet
        this.petService.createPet({
            name: this.petForm.name,
            status: this.petForm.status,
            kindId: this.petForm.kindId,
            genderId: this.petForm.genderId,
            // ownerEmail will be handled by backend from JWT usually, or we can inject AuthService
        }).subscribe({
            next: (res) => {
                // 2. Here we would upload media if we had a MediaService implemented
                // For now, redirect to pets list
                this.isSaving.set(false);
                this.router.navigate(['/pets']);
            },
            error: () => {
                this.isSaving.set(false);
            }
        });
    }

    cancel() {
        this.router.navigate(['/pets']);
    }
}
