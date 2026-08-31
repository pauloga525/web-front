import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { ConfiguracionPublicaService } from '../../services/configuracion-publica.service';

export interface ContactoAsunto { id: number; label: string; emailDestino: string; }
export interface ContactoInfo   { id: number; icon: string; title: string; details: string[]; extra?: string; }
export interface ContactoRed    { id: number; nombre: string; url: string; red: string; }

export interface ContactoConfig {
  heroTitulo:      string;
  heroDescripcion: string;
  mapImageUrl:     string;
  mapLinkUrl:      string;
  infoCards:       ContactoInfo[];
  redes:           ContactoRed[];
  formTitulo:      string;
  formDescripcion: string;
  formBotonLabel:  string;
  asuntos:         ContactoAsunto[];
}

// Copia genérica/segura — nada de datos de otra institución inventados.
// Las listas quedan vacías hasta que se carguen datos reales desde el panel admin.
const DEFAULT: ContactoConfig = {
  heroTitulo:      'Ponte en contacto',
  heroDescripcion: 'Estamos aquí para resolver tus dudas y apoyarte en tu proceso académico.',
  mapImageUrl:     '',
  mapLinkUrl:      'https://maps.google.com',
  infoCards: [],
  redes: [],
  formTitulo:      'Envíanos un mensaje',
  formDescripcion: 'Completa el formulario y nos pondremos en contacto contigo lo antes posible.',
  formBotonLabel:  'Enviar mensaje',
  asuntos: [],
};

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContactPageComponent implements OnInit {
  config: ContactoConfig = DEFAULT;

  // Form Data
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false
  };

  constructor(private configPublica: ConfiguracionPublicaService) {}

  ngOnInit(): void {
    this.configPublica.get<ContactoConfig>('contacto', DEFAULT).subscribe(cfg => {
      this.config = { ...DEFAULT, ...cfg };
    });
  }

  onSubmit() {
    if (this.formData.name && this.formData.email && this.formData.subject && this.formData.message && this.formData.privacy) {
      // TODO: no existe todavía un endpoint de backend para recibir mensajes de contacto.
      console.log('Formulario enviado:', this.formData);
      alert('Mensaje enviado exitosamente. Nos pondremos en contacto pronto.');
      this.resetForm();
    } else {
      alert('Por favor completa todos los campos y acepta la política de datos.');
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
      privacy: false
    };
  }
}
