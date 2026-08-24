import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventItem } from '../event-card/event-card.component';

@Component({
  selector: 'app-featured-event',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-event.component.html',
  styleUrl: './featured-event.component.css'
})
export class FeaturedEventComponent {
  @Input() event!: EventItem;
}
