import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../services/storage.service';

interface CouncilMember {
  title: string;
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-student-council-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './student-council-page.component.html',
  styleUrl: './student-council-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StudentCouncilPageComponent implements OnInit {
  isDarkMode = false;

  councilMembers: CouncilMember[] = [
    {
      title: 'Presidente',
      name: 'Juan Martínez García',
      description: 'Delegado general del consejo estudiantil con experiencia en gestión participativa.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbLnzWkOvRoJK0GN4REi6k40z9cEnD0aS9Q8cr1DAbxCHrwDuf14hSIiqoaBVgCN6gAkWEKPB5GrJt60pHZVocMcqu3l-hocF_G1avl9Y_Hb8Zy76POiehXAE9NAaYa0RzLwT1L6zENvrYG42lmA9BeNibZnl7Pxj-l7_xAVTGgh3u9J_dNQ2VgrZNa_5zBkOwSBxS59kVEJt-y40e0qOu_SETc5V0wDF4Bcic3b0o37pjenmk0EDmtZ8xKVlMKrHAyhSJlCEEgHA'
    },
    {
      title: 'Vicepresidente',
      name: 'María Elena Rodríguez',
      description: 'Responsable de coordinar iniciativas y proyectos estudiantiles.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOeifk3uOOJALmGa5xkprbcONAwzqLCKY1dF5F5L7TYL6q3oJSJHxGQzvOa7NqJz_lcEPtTUpma6cSXzb2nzhMcnsbXm5Bd0Uss-7PEHw129M8NSoK_GQdOdF7Y7YaTPS53QuPCdXlp5FKv4aBvL4jqtAqFg9bZxuqVj9_wwb8sja3uH755dQxPr32bn7hJu-Y89D1zbo8wkKNGrEQwg7-HucgJw734W8g8YLAColLpZjOHGTge8tfW_MEwaU1AmX6p_Ne3Z9Y0oQ'
    },
    {
      title: 'Secretario General',
      name: 'Carlos Andrés López',
      description: 'Encargado del registro y documentación de actividades del consejo.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc78gAPihn4y7RfjIzErvUikVRHxlKyE2ozTPmmejVZhaIYpqK3gtvrQ9zb514cX3S8xXbgK0SDn55ygNuCrPooKwgCoBwLFK7KaY0syCoSxeGtrBEJCKHT-1-dNfLrvmLPrlBgMm9vv4lUqLncIT0LpDJDwbxdjQcPVDBxVoJuFuTwq2I2yt9SRbUJ469liHtB_TMrVheAFLKlwT6CJtK6C38Hu7lspWpvB4pAuqMq_UEQ4wAIhfykW2ci2iql6295tyeAAMhA-A'
    },
    {
      title: 'Tesorero',
      name: 'Sofía Díaz Campos',
      description: 'Administra los fondos y presupuestos de actividades estudiantiles.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvF5iOlgDfUXiQVkqCXlz7d6m5NJ5N_Xp-Z0VBF8JcPMdbGJy2aZoCKvgrfSiQWggHy5KkuZ0cdFcuFDzX9jqMUFHepdB0SqWLrs2AMVbQ0QLgCqYoSYzFNQFNbggJHh_x9XYZpT_Kl1ruUZ1A15M3sTxpyM4bvVvhw9frRTOj5kBkppXIzs9uGsfipk3zWLJc0DiDLrFbNEJ6tAFPqqrtgHguLrX8LnYskEauRsdu9vS0AOFBg7ihM8D_QZ2zyq24E_vHREv5WG0'
    },
    {
      title: 'Coordinador de Bienestar',
      name: 'Diego Fernando Ruiz',
      description: 'Promotor del bienestar físico y mental de la comunidad estudiantil.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJM3saOHZ_2WXsf4yCnbEgRPAaVDr2aqp645iVZ0S6kiIh1O7l6SUedFbw40ubq2AIRJ8CFQ8-54CX2OFrDahoMqVpWiDphAYFdCguqv-W6qa7QLpZ1GDLRyva1Gvee2j1xCFjUzbZ5r3hJh8WhYPmcrUNFzETixNccBHsMA6JBuO9PUMUJtoWhr9yp0oT8NCZ7l8_4kStN8jDH3juoW07dG-78TmXtxC1ZJwg9IR4UXWQONpSElo8oQSTTBDetFo2iOkxJ3vrxQY'
    },
    {
      title: 'Coordinadora de Comunicación',
      name: 'Alejandra Moreno Sánchez',
      description: 'Responsable de la difusión y comunicación de eventos estudiantiles.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2o--I8OlJHisCnSmfgFlI39XbKGjNnFxarroz8iGM4E0hXJy_QSGksOaePAQDvQzpfMt8of-ECbuWMOq77vqJ4htv32hipzQzJp3gs_OOGSEV2Z115TTpuJpgy-AucfnmgEmc5FndEQueIvd4WeYP4XYctTJ-J2AT723rPFF_7K2HIBH2vqZ_Sa9A0XzeWiA_GjYfk1AFxe9zCC3R3nQeEh_E6TRP_ZYNKV8cigDebO7sR0w6etkGkODSIFI2ItwnN2uL5SXbQs'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private storage: StorageService) {}

  ngOnInit() {
    this.checkDarkMode();
  }

  openDetail(memberId: number) {
    console.log('Miembro del consejo seleccionado:', this.councilMembers[memberId]);
    // Aquí puedes implementar la lógica para abrir un modal o redirigir a una página de detalle
  }

  private checkDarkMode() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      this.isDarkMode = htmlElement.classList.contains('dark');
    }
  }
}
