import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { EventosApiService, EventoApi } from '../../services/eventos-api.service';
import { EventItem } from '../../components/event-card/event-card.component';

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  isActive: boolean;
}

interface GalleryImage {
  url: string;
  alt: string;
}

/** Forma que espera el template del event-detail */
interface EventView {
  title: string;
  image: string;
  day: string;
  month: string;
  date: string;
  location: string;
  description: string;
  descripcionCompleta: string;
  category: string;
  categoriaColor: string;
  direccion: string;
  registroHabilitado: boolean;
  registroLabelBoton: string;
  registroUrl: string;
  slug: string;
  _id: string;
}

const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

function toEventView(e: EventoApi): EventView {
  const parts = (e.fecha ?? '').split('-');
  const mesIdx = parts[1] ? Number.parseInt(parts[1], 10) - 1 : 0;
  return {
    title:               e.titulo,
    image:               e.imagenPrincipal,
    day:                 parts[2] ?? '',
    month:               MESES[mesIdx] ?? '',
    date:                `${e.horaInicio ?? '08:00'} - ${e.horaFin ?? '17:00'}`,
    location:            e.ubicacion,
    description:         e.descripcionCorta,
    descripcionCompleta: e.descripcionCompleta ?? '',
    category:            e.categoria,
    categoriaColor:      e.categoriaColor ?? 'blue',
    direccion:           e.direccion ?? '',
    registroHabilitado:  e.registro?.habilitado ?? false,
    registroLabelBoton:  e.registro?.labelBoton ?? 'Inscribirse',
    registroUrl:         e.registro?.url ?? '',
    slug:                e.slug,
    _id:                 e._id,
  };
}

function toEventItem(e: EventoApi): EventItem {
  const parts = (e.fecha ?? '').split('-');
  const mesIdx = parts[1] ? Number.parseInt(parts[1], 10) - 1 : 0;
  return {
    id:             e.slug || e._id,
    title:          e.titulo,
    date:           `${e.horaInicio ?? '08:00'} - ${e.horaFin ?? '17:00'}`,
    day:            parts[2] ?? '',
    month:          MESES[mesIdx] ?? '',
    category:       e.categoria,
    categoriaColor: e.categoriaColor,
    location:       e.ubicacion,
    description:    e.descripcionCorta,
    image:          e.imagenPrincipal,
  };
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, BreadcrumbComponent, FooterComponent],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class EventDetailComponent implements OnInit {
  eventId!: string;
  event: EventView | null = null;
  otherEvents: EventItem[] = [];
  loading = true;

  // El template usa estas propiedades directamente
  agenda: AgendaItem[] = [];
  galleryImages: GalleryImage[] = [];

  constructor(private readonly route: ActivatedRoute, private readonly eventosApi: EventosApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.loading = true;
      this.eventosApi.getBySlug(this.eventId).subscribe({
        next: ev => {
          this.event = toEventView(ev);
          this.loading = false;

          // Mapear agenda del backend al formato del template
          this.agenda = (ev.agenda ?? []).map((item, i) => ({
            time:        item.hora,
            title:       item.titulo,
            description: item.descripcion ?? '',
            isActive:    i === 0,
          }));

          // Galería del backend
          this.galleryImages = (ev.galeria ?? []).map((url, i) => ({
            url,
            alt: `Imagen ${i + 1}`,
          }));

          // Otros eventos
          this.otherEvents = this.eventosApi.getAll()
            .filter(e => e._id !== ev._id)
            .slice(0, 3)
            .map(toEventItem);
        },
        error: () => { this.loading = false; }
      });
    });
  }

  onRegister() {
    const url = this.event?.registroUrl;
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('¡Registro confirmado! Te enviamos un correo de confirmación.');
    }
  }
}
