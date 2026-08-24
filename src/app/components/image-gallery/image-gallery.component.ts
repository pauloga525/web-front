import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GalleryImageItem {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class ImageGalleryComponent implements OnInit {
  @Input() images: GalleryImageItem[] = [];
  @Input() title: string = '';
  @Input() description: string = '';

  selectedImageIndex: number = 0;
  isZoomed: boolean = false;
  zoomX: number = 0;
  zoomY: number = 0;
  thumbnailScrollPosition: number = 0;

  ngOnInit() {
    if (this.images.length > 0) {
      this.selectedImageIndex = 0;
    }
  }

  get selectedImage(): GalleryImageItem {
    return this.images[this.selectedImageIndex] || this.images[0];
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
    this.isZoomed = false;
    this.scrollThumbnailIntoView(index);
  }

  nextImage() {
    if (this.selectedImageIndex < this.images.length - 1) {
      this.selectImage(this.selectedImageIndex + 1);
    }
  }

  previousImage() {
    if (this.selectedImageIndex > 0) {
      this.selectImage(this.selectedImageIndex - 1);
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.isZoomed) return;

    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    this.zoomX = percentX;
    this.zoomY = percentY;
  }

  handleMouseEnter() {
    this.isZoomed = true;
  }

  handleMouseLeave() {
    this.isZoomed = false;
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
  }

  scrollThumbnailIntoView(index: number) {
    setTimeout(() => {
      const thumbnail = document.querySelector(
        `.thumbnail-item[data-index="${index}"]`
      ) as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }, 0);
  }

  get canGoPrevious(): boolean {
    return this.selectedImageIndex > 0;
  }

  get canGoNext(): boolean {
    return this.selectedImageIndex < this.images.length - 1;
  }
}
