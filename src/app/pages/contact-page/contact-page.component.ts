import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContactPageComponent {
  // Contact Information
  contactInfo = [
    {
      icon: 'location_on',
      title: 'Sede Principal',
      details: [
        'Av. Principal 123, Ciudad Universitaria',
        'Bogotá, Colombia'
      ]
    },
    {
      icon: 'call',
      title: 'Teléfono',
      details: [
        '+57 601 123 4567'
      ],
      extra: 'Lunes a Viernes, 8am - 6pm'
    },
    {
      icon: 'mail',
      title: 'Email',
      details: [
        'admisiones@universidad.edu.co',
        'contacto@universidad.edu.co'
      ]
    }
  ];

  // Map
  mapImage = '';

  // Social Media
  socialMedia = [
    { icon: 'svg-facebook', name: 'Facebook', url: '#' },
    { icon: 'svg-twitter', name: 'Twitter', url: '#' },
    { icon: 'svg-instagram', name: 'Instagram', url: '#' },
    { icon: 'svg-linkedin', name: 'LinkedIn', url: '#' }
  ];

  // Form Data
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false
  };

  subjectOptions = [
    { value: 'admisiones', label: 'Admisiones' },
    { value: 'academico', label: 'Información Académica' },
    { value: 'investigacion', label: 'Investigación' },
    { value: 'soporte', label: 'Soporte Técnico' },
    { value: 'otro', label: 'Otro' }
  ];

  onSubmit() {
    if (this.formData.name && this.formData.email && this.formData.subject && this.formData.message && this.formData.privacy) {
      console.log('Formulario enviado:', this.formData);
      // Here you would typically call a service to send the form
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
