import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pet } from 'shared-logic';

@Component({
  selector: 'app-pets-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pets-table.component.html',
  styleUrl: './pets-table.component.scss'
})
export class PetsTableComponent {
  @Input() pets: Pet[] = [];

  trackById(index: number, item: Pet) {
    return item.id;
  }
}