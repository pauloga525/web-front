import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConsejoApiService, MiembroConsejoApi } from '../../services/consejo-api.service';

@Component({
  selector: 'app-student-council-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './student-council-page.component.html',
  styleUrl: './student-council-page.component.css',
})
export class StudentCouncilPageComponent implements OnInit {
  councilMembers: MiembroConsejoApi[] = [];

  constructor(private consejoApi: ConsejoApiService) {}

  ngOnInit() {
    this.consejoApi.miembros$.subscribe(list => this.councilMembers = list);
  }

  openDetail(memberId: number) {
    // Reservado para una futura vista de detalle por miembro.
  }
}
