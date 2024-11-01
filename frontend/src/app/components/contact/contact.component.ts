import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule], // Incluye CommonModule aquí
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [UserService]
})
export class ContactComponent {
  email: string = '';
  asunto: string = '';
  descripcion: string = '';
  formSubmitted: boolean = false;

  constructor(private userService: UserService) { }

  enviarMensaje(): void {
    this.formSubmitted = true;
    if (!this.email.match(/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/)) {
      return;
    }
    this.userService.enviarMensaje(this.email, this.asunto, this.descripcion).subscribe(response => {
      console.log('Correo enviado correctamente', response);
      alert('Correo enviado correctamente');
      window.location.reload();
    }, error => {
      console.error('Error al enviar el correo', error);
      alert('Error al enviar el correo');
    });
  }
}