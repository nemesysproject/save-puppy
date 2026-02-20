import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Shelter } from 'shared-logic';

@Component({
  selector: 'app-shelters-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shelters-table.component.html',
  styleUrl: './shelters-table.component.scss'
})
export class SheltersTableComponent {
  @Input() shelters: Shelter[] = [];

  trackById(index: number, item: Shelter) {
    return item.id;
  }
}
