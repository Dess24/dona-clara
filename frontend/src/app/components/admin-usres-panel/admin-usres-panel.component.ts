import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Navbar3Component } from '../home/navbar3/navbar3.component';
import { FooterComponent } from '../home/footer/footer.component';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { CarritoService } from '../../services/carrito.service'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-usres-panel',
  standalone: true,
  imports: [Navbar3Component, FooterComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './admin-usres-panel.component.html',
  styleUrl: './admin-usres-panel.component.css',
  providers: [UserService, ProductoService, CarritoService]
})
export class AdminUsresPanelComponent implements OnInit {

  @ViewChild('myText') myText!: ElementRef;
  @ViewChild('myCheckbox') myCheckbox!: ElementRef;
  productos: any[] = [];
  categorias: any[] = [];
  users: any[] = [];
  displayedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  errorMessage: string | null = null;
  searchQuery: string = '';
  selectedUser: any = null;
  currentUser: any = null;
  sortState: number = 0; // 0: no ordenado, 1: ascendente, 2: descendente
  userHistoriales: any[] = [];
  filtroAlfabeticoActivo: string | null = null;


  constructor(private userService: UserService, private productoService: ProductoService, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.getAllUsuarios();
    this.getCurrentUser();
  }

  selectUser(user: any): void {
    this.selectedUser = user;
  }

  // Buscar todos los usuarios
  getAllUsuarios(): void {
    this.userService.getAllUsuarios().subscribe(
      (response) => {
        this.users = response;
        this.updateDisplayedUsers();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getCurrentUser(): void {
    this.userService.getUserInfo().subscribe(
      data => {
        this.currentUser = data.user;
      },
      error => {
        this.errorMessage = 'Error al obtener el usuario actual';
        console.error('Error al obtener el usuario actual', error);
      }
    );
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.users.length) {
      this.currentPage++;
      this.updateDisplayedUsers();
      document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedUsers();
      document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  buscarPorNombre(): void {
    this.userService.buscarPorNombre(this.searchQuery).subscribe(
      (response) => {
        if (response.usuarios.length === 0) {
          alert('No se encontraron usuarios con ese criterio');
          window.location.reload(); 
        } else {
          this.users = response.usuarios;
          this.updateDisplayedUsers();
        }
      },
      (error) => {
        console.error('Error searching users:', error);
      }
    );
  }

  ordenarAlfabeticamente(orden: string): void {
    if (this.users.length > 0 && this.users[0].name) {
      if (orden === 'asc') {
        this.users.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        this.users.sort((a, b) => b.name.localeCompare(a.name));
      }
      this.updateDisplayedUsers(); // Actualizar los usuarios mostrados después de ordenar
    } else {
      console.error('No se puede ordenar, la propiedad "name" no existe en los objetos de la lista "users".');
    }
  }
  

  aplicarFiltros(): void {
  if (this.filtroAlfabeticoActivo) {
    const orden = this.filtroAlfabeticoActivo.endsWith('asc') ? 'asc' : 'desc';
    this.ordenarAlfabeticamente(orden);
  }
  this.updateDisplayedUsers(); // Asegúrate de actualizar los usuarios mostrados después de aplicar los filtros
}

  alertBuscar() {
    const modal = document.getElementById('alert-buscar') as HTMLElement;
    modal.style.display = 'flex';
    modal.classList.add('fade-in');
  
    setTimeout(() => {
      modal.classList.remove('fade-in');
      modal.classList.add('fade-out');
  
      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fade-out');
      }, 500); // Duration of fade-out animation
    }, 2000);
  }
  
  alertCloseBuscar() {
    const modal = document.getElementById('alert-buscar') as HTMLElement;
    modal.style.display = 'none';
  }

  // Borrar usuario por ID
  borrarUsuario(id: number): void {
    this.userService.borrarUsuario(id).subscribe(
      response => {
        this.getAllUsuarios(); // Recargar la lista de usuarios después de borrar
      },
      error => {
        this.errorMessage = 'Error al borrar el usuario';
        console.error('Error al borrar el usuario', error);
      }
    );
  }

  confirmDelete() {
    if (this.selectedUser) {
      this.borrarUsuario(this.selectedUser.id);
      this.modalClose2();
    }
  }

  // Listar todos los productos
  getProductos(): void {
    this.productoService.getProductos().subscribe(
      data => {
        this.productos = data;
      },
      error => {
        this.errorMessage = 'Error al cargar los productos';
        console.error('Error al cargar los productos', error);
      }
    );
  }

  uncheckCheckbox() {
    this.myCheckbox.nativeElement.checked = false;
  }

  changeTextColor() {
    if (this.myText) {
      this.myText.nativeElement.style.color = 'rgb(17 24 39)';
      this.myText.nativeElement.style.textDecoration = 'none';
    }
  }

  modal() {
    const modal = document.getElementById('container-modal') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose() {
    const modal = document.getElementById('container-modal') as HTMLElement;
    modal.style.display = 'none';

    // Restaurar colores originales de las opciones seleccionadas
    const selectedOptions = modal.querySelectorAll('.selected');
    selectedOptions.forEach(option => {
      const element = option as HTMLElement;
      element.style.backgroundColor = ''; // Color de fondo original
      element.style.color = ''; // Color de texto original
      element.classList.remove('selected');

      // Restaurar colores originales de los elementos hijos
      const children = element.querySelectorAll('*');
      children.forEach(child => {
        (child as HTMLElement).style.color = '';
      });
    });
  }

  toggleDropdown() {
    const dropdown = document.getElementById('dropdownSort1');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }

  cambiarColorOpcion(event: Event): void {
    const target = event.target as HTMLElement;
    const isSelected = target.classList.contains('selected');

    if (isSelected) {
      // Restaurar colores originales
      target.style.backgroundColor = ''; // Color de fondo original
      target.style.color = ''; // Color de texto original
      target.classList.remove('selected');
    } else {
      // Cambiar a colores seleccionados
      target.style.backgroundColor = 'rgb(22 163 74)'; // Cambia el color de fondo
      target.style.color = 'white'; // Cambia el color del texto
      target.classList.add('selected');
    }

    // Cambiar el color de todos los elementos hijos y hacerlos no clickeables
    const children = target.querySelectorAll('*');
    children.forEach(child => {
      const childElement = child as HTMLElement;
      childElement.style.color = isSelected ? '' : 'white';
      childElement.style.pointerEvents = isSelected ? '' : 'none';
    });
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const adminText = document.getElementById('admin-text');
    if (adminText) {
      if (checkbox.checked) {
        adminText.style.color = 'rgb(20 83 45)',
        adminText.style.textDecoration = 'underline'; // Change to desired color
      } else {
        adminText.style.color = '';
        adminText.style.textDecoration = 'none'; // Revert to original color
      }
    }
  }

  modal2(user: any): void {
    this.selectedUser = user;
    const modal = document.getElementById('deleteModal') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose2() {
    this.selectedUser = null;
    const modal = document.getElementById('deleteModal') as HTMLElement;
    modal.style.display = 'none';
  }

  modal3(user: any): void {
    this.selectedUser = user;
    const modal = document.getElementById('sure-modal') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose3() {
    this.selectedUser = null;
    const modal = document.getElementById('sure-modal') as HTMLElement;
    modal.style.display = 'none';
  }

  // Método para hacer admin a un usuario
  makeAdmin(userId: number): void {
    this.userService.makeAdmin(userId).subscribe(
      response => {
        console.log('Usuario ahora es admin', response);
        this.getAllUsuarios();
      },
      error => {
        this.errorMessage = 'Error al hacer admin al usuario';
        console.error('Error al hacer admin al usuario', error);
      }
    );
  }

  removeAdmin(userId: number): void {
    this.userService.removeAdmin(userId).subscribe(
      response => {
        console.log('Usuario ya no es admin', response);
        this.getAllUsuarios(); // Recargar la lista de usuarios
      },
      error => {
        this.errorMessage = 'Error al quitar admin al usuario';
        console.error('Error al quitar admin al usuario', error);
      }
    );
  }

  confirmAction() {
    if (this.selectedUser.admin) {
      this.removeAdmin(this.selectedUser.id);
    } else {
      this.makeAdmin(this.selectedUser.id);
    }
    this.modalClose3();
  }

  isCurrentUser(user: any): boolean {
    return this.currentUser && this.currentUser.email === user.email;
  }

// Función para ordenar usuarios
ordenarUsuarios(campo: string, orden: string): void {
  this.userService.ordenarUsuarios(campo, orden).subscribe(
    data => {
      this.users = data;
    },
    error => {
      this.errorMessage = 'Error al ordenar los usuarios';
      console.error('Error al ordenar los usuarios', error);
    }
  );
}

  ordenarPorPrecio(): void {
    if (this.sortState === 0) {
      this.productos.sort((a, b) => a.precio - b.precio);
      this.sortState = 1;
    } else if (this.sortState === 1) {
      this.productos.sort((a, b) => b.precio - a.precio);
      this.sortState = 2;
    } else {
      this.getProductos();
      this.sortState = 0;
    }
  }

  showAlert1() {
    setTimeout(() => {
      const modal = document.getElementById('alert-container1') as HTMLElement;
      modal.style.display = 'flex';
      modal.classList.add('fade-in');

      setTimeout(() => {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');

        setTimeout(() => {
          modal.style.display = 'none';
          modal.classList.remove('fade-out');
        }, 500); // Duration of fade-out animation
      }, 2000);
    }, 1000); // Wait for 1 second before executing the function
  }

  showAlert3() {
    setTimeout(() => {
      const modal = document.getElementById('alert-container3') as HTMLElement;
      modal.style.display = 'flex';
      modal.classList.add('fade-in');

      setTimeout(() => {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');

        setTimeout(() => {
          modal.style.display = 'none';
          modal.classList.remove('fade-out');
        }, 500); // Duration of fade-out animation
      }, 2000);
    }, 1000); // Wait for 1 second before executing the function
  }

  modalClose5() {
    const modal = document.getElementById('alert-container1') as HTMLElement;
    modal.style.display = 'none';
  }

  modalClose6() {
    const modal = document.getElementById('alert-container3') as HTMLElement;
    modal.style.display = 'none';
  }


  modal7(user: any): void {
    this.selectedUser = user;
    this.getHistorialesByUser(user.id);
    const modal = document.getElementById('historyModal') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose7() {
    this.selectedUser = null;
    this.userHistoriales = [];
    const modal = document.getElementById('historyModal') as HTMLElement;
    modal.style.display = 'none';
  }

  getHistorialesByUser(userId: number): void {
    this.carritoService.getHistorialesByUser(userId).subscribe(
      data => {
        this.userHistoriales = data;
        const modal = document.getElementById('historyModal') as HTMLElement;
        modal.style.display = 'flex';
      },
      error => {
        console.error('Error al obtener los historiales del usuario:', error);
      }
    );
  }

}