import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Navbar3Component } from '../home/navbar3/navbar3.component';
import { UserService } from '../../services/user.service';
import { Router} from '@angular/router';
import { FooterComponent } from '../home/footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, Navbar3Component, FormsModule, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [UserService]
})
export class ContactComponent {
  email: string = '';
  asunto: string = '';
  descripcion: string = '';
  formSubmitted: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  enviarMensaje(): void {
    this.formSubmitted = true;
  
    // Validación de email
    if (!this.email.match(/^[a-zA-Z0-9._%+-]+@(gmail.com|hotmail.com|outlook.com)$/)) {
      return;
    }
  
    // Envío del mensaje
    this.userService.enviarMensaje(this.email, this.asunto, this.descripcion).subscribe(
      response => {
        // Aquí nos aseguramos de que la respuesta sea exitosa
        if (response && response.message === 'Correo enviado correctamente') {
          console.log('Correo enviado correctamente', response);
          this.showAlert(); // Solo se ejecuta si el backend responde con un mensaje de éxito
          // Si decides recargar la página, asegúrate de que solo lo hagas en caso de éxito
          window.location.reload();
        } else {
          // console.error('Error en la respuesta del backend', response);
          // this.showAlert2(); // Se ejecuta si la respuesta del backend no es exitosa
          window.location.reload();
        }
      },
      error => {
        // Aquí manejamos cualquier error que pueda ocurrir en la solicitud HTTP
        // console.error('Error al enviar el correo', error);
        // this.showAlert2(); // Se ejecuta si ocurre un error al contactar el backend
        window.location.reload();
      }
    );
  }
  
  

  showAlert() {
    setTimeout(() => {
        const modal = document.getElementById('alert-container') as HTMLElement;
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
    }, 200); // Delay before showing the alert
}
  
  modalClose() {
    const modal = document.getElementById('alert-container') as HTMLElement;
    modal.style.display = 'none';
  }

  showAlert2() {
    setTimeout(() => {
        const modal = document.getElementById('alert-container2') as HTMLElement;
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
    },500); // Delay before showing the alert
}
  
  modalClose2() {
    const modal = document.getElementById('alert-container2') as HTMLElement;
    modal.style.display = 'none';
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

  
}