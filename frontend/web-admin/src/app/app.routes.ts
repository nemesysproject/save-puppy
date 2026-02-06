import { Routes } from '@angular/router';

import { SheltersComponent } from './pages/shelters/shelters.component';
import { PetsComponent } from './pages/pets/pets.component';
import { OwnersComponent } from './pages/owners/owners.component';

export const routes: Routes = [
  { path: '', redirectTo: '/shelters', pathMatch: 'full' },
  { path: 'shelters', component: SheltersComponent },
  { path: 'pets', component: PetsComponent },
  { path: 'owners', component: OwnersComponent },
  { path: 'settings', component: SheltersComponent }, // Placeholder
  { path: 'help', component: SheltersComponent },// Placeholder,
  { path: '**', redirectTo: '/shelters' }
];
