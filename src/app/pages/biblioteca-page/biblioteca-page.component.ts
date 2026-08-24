import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  available: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-biblioteca-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './biblioteca-page.component.html',
  styleUrls: ['./biblioteca-page.component.css']
})
export class BibliotecaPageComponent implements OnInit {
  books: Book[] = [];
  searchTerm: string = '';
  filterCategory: string = 'Todo el catálogo';
  sortBy: string = 'Más recientes';
  currentPage: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.initializeBooks();
  }

  initializeBooks(): void {
    this.books = [
      {
        id: 1,
        title: 'Historia del Arte',
        author: 'E. Gombrich',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsViqMq4ADJw9lzSga4Pnx6OdTBCcHhhfaRltkWtG2p7VjXYqfDkDB6x2el0DsgKWPjAGYsFdLmLEnV6CnefeRRgJ9odH2NV7xKUqDlDK-nIYNk6q4sb75ZsUdly-RFZOYb8kaVV8ugNr_NQFzjrXx0fzBBldg0CfM1qybYij_Nfonp3PbDyF8n7pzWB1xnPyOdFlLhgOWIJRHPugr0KnKUaNmJlQARV59Do-jlXMADB3t55-zXKffA5g49W0KA2WG8A-itBwbCbI',
        available: true,
        isNew: true
      },
      {
        id: 2,
        title: 'Diseño UX/UI',
        author: 'J. Garrett',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaTPMB4Ab_oN9goi0ri2kwGz7sII6PB4NqmdvMhy0pJk5AWwVehFBP4HHpIa__spF3m7rRPXIhof5-F7bSO9z3z9d9mHrJTLNMnkn9cL3TwyIbAREFwL9hlfj-jx31lTTduNWsnBz7pTvHjZOCDSdBlv1nlLhM73iAQwaPQCCPxwic3RqCCGsIB-h6ozmpQWaMvPo1hfgEvdOj3W8GrQSbeIF8vyK2q5MXa5mbg8G4VGD_E_SDhCpRCXChnLrH4-66fJzOhVpUXYA',
        available: true,
        isNew: false
      },
      {
        id: 3,
        title: 'Biología Molecular',
        author: 'B. Alberts',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsWjWLwa2tFi2vhMxInoFvoLJm2cTC33b2qAV5dNsZ43oioB_102-FeQjThfiNoQ8HBXCPUOAsUHNFOd-w008wiZ3NnGLWE27jPNk3r5-R0CphY8jvbl0lPJBERhE2igsws1sdsWxp3pGrnnCpfp7sD4nD4M3XzzfgpcQYnKuuB3K6S3TV90KgBwi9KF2AO_Vr_m-Gp_1yGA88xavesFcFolKAksQ9F7kPfV7-EnDe4gs8m3mIoF3LasGoTrrQbV5zwa6RLnXNcYw',
        available: false,
        isNew: true
      },
      {
        id: 4,
        title: 'Matemáticas Avanzadas',
        author: 'D. Zill',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJN4QOycIaRAoc_dBCuRY640Kf1J_47GVGFmlKBeUFNofTeU9ELr1nbGt9syiafESYVBelSRhryEIyC8h-SSIgTRQJEtcUvfY-AhHdWX_m9XrgQNXWerGw8niNtThchqlQWMqL4VbgCy09G0dN5WuSvi3V0TO16Ji5ZJsPjQqweWTA1fTORsUhp6xSQ0fs6k-gE9iVhruvyFnpjgY-U6_VKoZDBysH1Yt7ZCJJ8EAyMNL9QZ02TJpxm3czn1kJS5UPCBZD5u-6pkk',
        available: true,
        isNew: false
      },
      {
        id: 5,
        title: 'Química Orgánica',
        author: 'L. Wade',
        image: '',
        available: true,
        isNew: false
      },
      {
        id: 6,
        title: 'Física Universitaria',
        author: 'Sears & Zemansky',
        image: '',
        available: true,
        isNew: false
      },
      {
        id: 7,
        title: 'Cálculo Diferencial',
        author: 'J. Stewart',
        image: '',
        available: false,
        isNew: false
      },
      {
        id: 8,
        title: 'Programación en C++',
        author: 'H. Deitel',
        image: '',
        available: true,
        isNew: false
      },
      {
        id: 9,
        title: 'Literatura Universal',
        author: 'Varios Autores',
        image: '',
        available: true,
        isNew: false
      },
      {
        id: 10,
        title: 'Psicología General',
        author: 'R. Feldman',
        image: '',
        available: true,
        isNew: false
      }
    ];
  }

  onSearch(): void {
    // Implementar la lógica de búsqueda
    console.log('Buscando:', this.searchTerm);
  }

  onFilterChange(): void {
    // Implementar la lógica de filtrado
    console.log('Filtro:', this.filterCategory);
  }

  onSortChange(): void {
    // Implementar la lógica de ordenamiento
    console.log('Ordenar por:', this.sortBy);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    // Implementar paginación
    console.log('Página:', page);
  }
}
