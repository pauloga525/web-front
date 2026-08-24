import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-admissions-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './admissions-page.component.html',
  styleUrls: ['./admissions-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdmissionsPageComponent {
  // Application Process Steps
  applicationSteps = [
    {
      stepNumber: 1,
      icon: 'edit_document',
      title: 'Solicitar en Línea',
      description: 'Completa el formulario de solicitud a través de nuestro portal de estudiantes seguro.'
    },
    {
      stepNumber: 2,
      icon: 'upload_file',
      title: 'Enviar Documentos',
      description: 'Carga tus certificados académicos, identificación y cartas de recomendación.'
    },
    {
      stepNumber: 3,
      icon: 'groups',
      title: 'Entrevista',
      description: 'Programa una entrevista virtual o presencial con un oficial de admisiones.'
    },
    {
      stepNumber: 4,
      icon: 'payments',
      title: 'Pago',
      description: 'Paga la cuota de matrícula para asegurar tu lugar para el semestre.'
    }
  ];

  // Requirements
  requirements = [
    {
      icon: 'check_circle',
      title: 'Diploma de Educación Media',
      description: 'Copia certificada o equivalente.'
    },
    {
      icon: 'check_circle',
      title: 'GPA Mínimo 3.0',
      description: 'En una escala de 4.0.'
    },
    {
      icon: 'check_circle',
      title: 'Dominio del Inglés',
      description: 'TOEFL 80+ o IELTS 6.5+.'
    },
    {
      icon: 'check_circle',
      title: 'Declaración Personal',
      description: 'Ensayo de 500 palabras.'
    },
    {
      icon: 'check_circle',
      title: 'Cartas de Recomendación',
      description: 'Dos referencias académicas.'
    },
    {
      icon: 'check_circle',
      title: 'Pasaporte Válido',
      description: 'Para estudiantes internacionales.'
    }
  ];

  // Downloads
  downloads = [
    {
      icon: 'download',
      label: 'Guía de Admisión'
    },
    {
      icon: 'download',
      label: 'Formulario Becas'
    },
    {
      icon: 'download',
      label: 'Catálogo 2024'
    }
  ];

  // Important Dates
  importantDates = [
    {
      title: 'Fecha Límite de Admisión Temprana',
      subtitle: 'Para el Semestre de Otoño 2024',
      date: 'NOV 15',
      year: '2023',
      isPrimary: true
    },
    {
      title: 'Decisión Regular',
      subtitle: 'Fecha de cierre de solicitud',
      date: 'JAN 30',
      year: '2024',
      isPrimary: false
    },
    {
      title: 'Solicitud de Beca',
      subtitle: 'Fecha límite de ayuda financiera',
      date: 'FEB 15',
      year: '2024',
      isPrimary: false
    },
    {
      title: 'Notificación de Aceptación',
      subtitle: 'Decisiones liberadas',
      date: 'MAR 15',
      year: '2024',
      isPrimary: false
    }
  ];
}
