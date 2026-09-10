import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Directiva que automáticamente agrega crossorigin="anonymous" a imágenes
 * de dominios externos para prevenir Tracking Prevention
 */
@Directive({
  selector: 'img[src*="lh3.googleusercontent"], img[src*="googleapis"], img[src*="via.placeholder"]',
  standalone: true
})
export class CrossOriginImageDirective implements OnInit {
  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.setAttribute('crossorigin', 'anonymous');
  }
}
