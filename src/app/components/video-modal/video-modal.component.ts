import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.css'
})
export class VideoModalComponent {
  @Input() isOpen = false;
  @Input() videoUrl = '';
  @Output() closed = new EventEmitter<void>();

  constructor(private readonly sanitizer: DomSanitizer) {}

  get safeVideoUrl(): SafeResourceUrl {
    const videoId = this.extractYoutubeId(this.videoUrl);
    if (!videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    // videoId is regex-validated to [a-zA-Z0-9_-]{11} above, so interpolating it
    // into this fixed youtube.com URL cannot introduce a different origin or scheme.
    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl); // NOSONAR: embedUrl is built from a regex-validated video ID only
  }

  private extractYoutubeId(url: string): string {
    if (!url) return '';

    // Already an embed URL: youtube.com/embed/VIDEO_ID
    const embedMatch = /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/.exec(url);
    if (embedMatch) return embedMatch[1];

    // Short URL: youtu.be/VIDEO_ID
    const shortMatch = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(url);
    if (shortMatch) return shortMatch[1];

    // Shorts: youtube.com/shorts/VIDEO_ID
    const shortsMatch = /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/.exec(url);
    if (shortsMatch) return shortsMatch[1];

    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    const watchMatch = /[?&]v=([a-zA-Z0-9_-]{11})/.exec(url);
    if (watchMatch) return watchMatch[1];

    return '';
  }

  closeModal(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
