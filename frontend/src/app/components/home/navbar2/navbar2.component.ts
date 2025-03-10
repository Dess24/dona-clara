import { Component, OnInit, ViewChildren, QueryList, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule} from '@angular/router';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from '../main/main.component';
import { CarritoService } from '../../../services/carrito.service'; 


@Component({
  selector: 'app-navbar2',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, HttpClientModule, MainComponent],
  templateUrl: './navbar2.component.html',
  styleUrl: './navbar2.component.css',
  providers: [UserService, CarritoService]
})
export class Navbar2Component {
  @ViewChildren('carouselItem') carouselItems!: QueryList<ElementRef>;
  isLoggedIn: boolean = false;
  isLoggedInAdmin: boolean = false;
  fotos: any[] = [];
  currentIndex: number = 0;
  userHistoriales: any[] = [];
  selectedUser: any = null;
  currentUser: any = null;
  currentPage: number = 1;
 itemsPerPage: number = 5; // Ajusta este valor según tus necesidades
  totalPages: number = 0;
  displayedHistoriales: any[] = [];

  constructor(private router: Router, private userService: UserService, private carritoService: CarritoService) {}



  modal(){
    const modal = document.getElementById('modal-container') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose(){
    const modal = document.getElementById('modal-container') as HTMLElement;
    modal.style.display = 'none';
  }

  ngOnInit(): void {

    this.userService.getFotosSlider().subscribe(data => {
      console.log(data); // Verifica los datos en la consola
      this.fotos = data;
    });

    this.isLoggedIn = !!localStorage.getItem('auth_token');
    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe(response => {
        this.isLoggedInAdmin = !!response.user.admin;
      });
    }
    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe(response => {
        this.isLoggedInAdmin = !!response.user.admin;
        this.currentUser = response.user;
      });
    }
  }

  onLogout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedIn = false;
    this.isLoggedInAdmin = false;
    this.isLoggedInAdmin = false;
    this.router.navigate(['/login']);
  }

  moveTo(section: string) {
    // Navega a la ruta "/inicio"
    this.router.navigate(['/inicio']).then(() => {
      // Después de navegar, desplázate a la sección
      const element = document.getElementById(section);
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }

  deleteImg(id: number): void {
    this.userService.borrarImagenSlider(id).subscribe(response => {
      this.fotos = this.fotos.filter(foto => foto.id !== id);
      this.nnextSlide();
    });
  }

  subirImagen(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userService.subirImagenSlider(file).subscribe(response => {
        // Actualizar la lista de fotos después de subir la imagen
        this.userService.getFotosSlider().subscribe(data => {
          this.fotos = data;
          this.nnextSlide();
        });
      });
    }
  }

  modal2(){
    const modal = document.getElementById('modal-container2') as HTMLElement;
    const hide = document.getElementById('wpp') as HTMLElement;
    modal.style.display = 'flex';
    hide.style.display = 'none';
  }

  modalClose2() {
    const modal = document.getElementById('modal-container2') as HTMLElement;
    const hide = document.getElementById('wpp') as HTMLElement;
    modal.style.display = 'none';
    hide.style.display = 'flex';
    window.location.reload(); // Recargar la página
  }

  openModal2AndCloseModal1() {
    this.modalClose();
    this.modal2();
}

  ngAfterViewInit() {
    this.nshowSlide(this.currentIndex);
  }



  nshowSlide(index: number, direction: 'left' | 'right' = 'left') {
    this.carouselItems.forEach((item, i) => {
      item.nativeElement.classList.add('hidden');
      item.nativeElement.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
      if (i === index) {
        item.nativeElement.classList.remove('hidden');
        item.nativeElement.classList.add(direction === 'left' ? 'slide-in-left' : 'slide-in-right');
      }
    });
  }

  nnextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.carouselItems.length;
    this.carouselItems.toArray()[this.currentIndex].nativeElement.classList.add('slide-out-right');
    this.currentIndex = nextIndex;
    this.nshowSlide(this.currentIndex, 'right');
  }

  nprevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
    this.carouselItems.toArray()[this.currentIndex].nativeElement.classList.add('slide-out-left');
    this.currentIndex = prevIndex;
    this.nshowSlide(this.currentIndex, 'left');
  }

  modal7(): void {
    this.selectedUser = this.currentUser;
    this.getHistorialesByUser();
    setTimeout(() => {
      const modal = document.getElementById('historyModal') as HTMLElement;
      modal.style.display = 'flex';
    }, 0);
  }
  
  modalClose7() {
    this.selectedUser = null;
    this.userHistoriales = [];
    this.displayedHistoriales = [];
    const modal = document.getElementById('historyModal') as HTMLElement;
    modal.style.display = 'none';
  }
  
  getHistorialesByUser(): void {
    if (this.currentUser) {
      this.carritoService.getHistorialesByUser(this.currentUser.id).subscribe(
        data => {
          this.userHistoriales = data;
          this.updateDisplayedHistoriales(); // Actualizar los historiales mostrados
        },
        error => {
          console.error('Error al obtener los historiales del usuario:', error);
        }
      );
    } else {
      console.error('No se encontró el usuario actual.');
    }
  }
  
  updateDisplayedHistoriales(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedHistoriales = this.userHistoriales.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.userHistoriales.length / this.itemsPerPage);
  }
  
  getPages(): number[] {
    if (this.totalPages <= 6) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else if (this.currentPage <= 3) {
      return [1, 2, 3, 4, 5, this.totalPages];
    } else if (this.currentPage >= this.totalPages - 2) {
      return [1, this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages];
    } else {
      return [1, this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2, this.totalPages];
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedHistoriales();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedHistoriales();
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedHistoriales();
    }
  }

  onScroll(): void {
    const navbar = document.getElementById('navbar') as HTMLElement;
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = 'rgba(27, 51, 95, 0.85)'; // Color sólido
    } else {
      navbar.style.backgroundColor = 'transparent'; // Fondo transparente
    }
  }
}
