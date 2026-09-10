import { Component, OnInit, PLATFORM_ID, Inject, effect } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'UETS';

  constructor(private readonly router: Router, @Inject(PLATFORM_ID) private readonly platformId: Object) {
    // Agregar crossorigin a imágenes de Google de forma global
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        setTimeout(() => {
          const googleImages = document.querySelectorAll('img[src*="lh3.googleusercontent"]');
          googleImages.forEach(img => {
            img.setAttribute('crossorigin', 'anonymous');
          });
        }, 100);
      });
    }
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      });
  }
}
