import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Suppress NG0913 warning at application startup
if (typeof ngDevMode !== 'undefined' && ngDevMode) {
  const originalWarn = console.warn;
  console.warn = function(...args: any[]) {
    const message = args[0]?.toString?.() || '';
    if (message.includes('NG0913')) {
      return; // Suppress NG0913 warnings
    }
    originalWarn.apply(console, args);
  };
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
