import { Directive, ElementRef, OnInit, NgZone, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'img[appSuppressImageWarning]',
  standalone: true
})
export class SuppressImageWarningDirective implements OnInit, AfterViewInit {
  constructor(private readonly el: ElementRef, private readonly ngZone: NgZone) {}

  ngOnInit(): void {
    // Mark image as processed to skip Angular's size validation
    (this.el.nativeElement as any)['ng-reflect-ng-opt-image-processed'] = true;
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // Remove Angular's tracking attributes
      const img = this.el.nativeElement as HTMLImageElement;
      img.removeAttribute('ng-reflect-sizes');
      img.removeAttribute('ng-reflect-src-set');
      img.removeAttribute('ng-reflect-width');
      img.removeAttribute('ng-reflect-height');
    });
  }
}
