import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConsejoApiService, MiembroConsejoApi } from '../../services/consejo-api.service';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

@Component({
  selector: 'app-student-council-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './student-council-page.component.html',
  styleUrl: './student-council-page.component.css',
})
export class StudentCouncilPageComponent implements OnInit {
  councilMembers: MiembroConsejoApi[] = [];
  heroImagen = '';

  constructor(
    private readonly consejoApi: ConsejoApiService,
    private readonly configPublica: ConfiguracionPublicaService,
  ) {}

  ngOnInit() {
    this.consejoApi.miembros$.subscribe(list => this.councilMembers = list);
    this.configPublica.get<{ heroImagen?: string }>('consejo_page', {}).subscribe(cfg => {
      this.heroImagen = cfg?.heroImagen || '';
    });
  }

  openDetail(memberId: number) {
    // Reservado para una futura vista de detalle por miembro.
  }
}
