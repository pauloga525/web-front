import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-pagination.component.html',
  styleUrl: './events-pagination.component.css'
})
export class EventsPaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 8;
  @Output() pageChange = new EventEmitter<number>();

  get pageNumbers(): number[] {
    const pages: number[] = [];
    
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (this.currentPage > 3) {
        pages.push(-1); // -1 represents "..."
      }
      
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (this.currentPage < this.totalPages - 2) {
        pages.push(-1); // -1 represents "..."
      }
      
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
