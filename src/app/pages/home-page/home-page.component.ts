import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { AcademicLevelsComponent } from '../../components/academic-levels/academic-levels.component';
import { EventsComponent } from '../../components/events/events.component';
import { CommunityComponent } from '../../components/community/community.component';
import { PreventiveSystemComponent } from '../../components/preventive-system/preventive-system.component';
import { SalesianCommunicationComponent } from '../../components/salesian-communication/salesian-communication.component';
import { NewsComponent } from '../../components/news/news.component';
import { InterestLinksComponent } from '../../components/interest-links/interest-links.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    StatsComponent,
    AcademicLevelsComponent,
    EventsComponent,
    CommunityComponent,
    PreventiveSystemComponent,
    SalesianCommunicationComponent,
    NewsComponent,
    InterestLinksComponent,
    FooterComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class HomePageComponent {}
