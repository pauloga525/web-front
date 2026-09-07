import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.css'
})
export class VideoModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() videoUrl = '';
  @Output() onClose = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  /**
   * Antes esto era un getter, recalculado en cada ciclo de detección de
   * cambios de Angular (que ocurre muy seguido: cualquier evento, timer,
   * respuesta HTTP...). Cada llamada a bypassSecurityTrustResourceUrl()
   * devuelve un objeto nuevo aunque la URL sea la misma cadena de texto,
   * así que Angular, al ver una referencia distinta, volvía a asignar
   * iframe.src en cada ciclo — reiniciando el video una y otra vez antes
   * de que pudiera reproducirse ("bucle" que nunca llega a reproducir
   * nada). Ahora se calcula una sola vez, cuando videoUrl realmente
   * cambia.
   */
  safeVideoUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoUrl']) {
      this.safeVideoUrl = this.computeSafeUrl(this.videoUrl);
    }
  }

  private computeSafeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeId(url);
    if (!videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractYoutubeId(url: string): string {
    if (!url) return '';

    // Already an embed URL: youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    // Short URL: youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // Shorts: youtube.com/shorts/VIDEO_ID
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    return '';
  }

  closeModal(): void {
    this.onClose.emit();
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
