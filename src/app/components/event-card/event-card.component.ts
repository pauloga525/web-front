import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface EventItem {
  id: number | string;
  title: string;
  date: string;
  day: string;
  month: string;
  category: string;
  categoriaColor?: string;
  location: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event!: EventItem;
}
