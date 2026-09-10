import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const ICONS: Record<string, string> = {
  gear:        '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.2-1.6l2-1.5-2-3.5-2.3 1a7 7 0 0 0-2.8-1.6L13 2h-2l-.7 2.8a7 7 0 0 0-2.8 1.6l-2.3-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .6.07 1.1.2 1.6l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 2.8 1.6L11 22h2l.7-2.8a7 7 0 0 0 2.8-1.6l2.3 1 2-3.5-2-1.5c.13-.5.2-1 .2-1.6z"/></svg>',
  robot:       '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="8" width="12" height="10" rx="2"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M12 2v4"/><path d="M9 22h6"/></svg>',
  computer:    '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>',
  chip:        '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M3 9h4M3 15h4M17 3v4M17 17v4M9 3v4M15 3v4M21 9h-4M21 15h-4"/></svg>',
  terminal:    '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  wrench:      '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 7a4 4 0 1 0-5 5l7 7 3-3-7-7z"/></svg>',
  factory:     '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V8l6 4V8l6 4V3h6v18z"/></svg>',
  hammer:      '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3l7 7-3 3-7-7z"/><path d="M5 21l9-9"/></svg>',
  car:         '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5"/><rect x="3" y="13" width="18" height="4" rx="1"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>',
  engine:      '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="7" width="16" height="10" rx="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/></svg>',
  bolt:        '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg>',
  plug:        '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 2v6M15 2v6"/><rect x="7" y="8" width="10" height="6" rx="2"/><path d="M12 14v8"/></svg>',
  battery:     '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/></svg>',
  users:       '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M2 21c0-3 4-5 7-5"/><path d="M15 16c3 0 7 2 7 5"/></svg>',
  book:        '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19a2 2 0 0 1 2-2h14"/><path d="M6 17V3h14v18"/></svg>',
  clipboard:   '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="5" y="6" width="14" height="16" rx="2"/></svg>',
  atom:        '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="4" ry="10"/></svg>',
  microscope:  '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18h12"/><path d="M9 18V10"/><path d="M9 10l3-3"/><path d="M12 7l3 3"/><circle cx="12" cy="14" r="2"/></svg>',
};

const FALLBACK = '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(private readonly sanitizer: DomSanitizer) {}

  getIcon(name: string): SafeHtml {
    // svg always comes from the hardcoded ICONS/FALLBACK map above, never from user input.
    const svg = ICONS[name] ?? FALLBACK;
    return this.sanitizer.bypassSecurityTrustHtml(svg); // NOSONAR: static, developer-authored SVG markup only
  }
}
