import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-restore',
  standalone: true,
  imports: [ NavbarComponent, FormsModule, CommonModule ], // Agrega CommonModule aquí
  templateUrl: './restore.component.html',
  styleUrl: './restore.component.css',
  providers: [UserService]
})
export class RestoreComponent {

  email: string = '';
  code1: string = '';
  code2: string = '';
  code3: string = '';
  code4: string = '';
  code5: string = '';
  code6: string = '';
  token: string = '';
  password: string = '';
  password_confirmation: string = '';
  message: string = '';

  constructor(private userService: UserService, private router: Router) {} // Inyecta Router

  generateResetCode(): void {
    this.userService.generateResetCode(this.email).subscribe(
      response => {
        this.message = response.message;
        // Abre el modal después de generar el código
        const modal = document.getElementById('container-modal3') as HTMLElement;
        modal.style.display = 'flex';
      },
      error => {
        this.message = error.error.message;
      }
    );
  }

  combineTokenAndResetPassword(): void {
    this.token = this.code1 + this.code2 + this.code3 + this.code4 + this.code5 + this.code6;
    this.resetPassword();
  }

  resetPassword(): void {
    this.userService.resetPassword(this.email, this.token, this.password, this.password_confirmation).subscribe(
      response => {
        this.message = response.message;
        this.modalClose();
        this.router.navigate(['/inicio']); // Navega a /inicio después de cerrar el modal
      },
      error => {
        this.message = error.error.message;
      }
    );
  }

  modal(): void {
    this.generateResetCode();
  }

  modalClose() {
    const modal = document.getElementById('container-modal3') as HTMLElement;
    modal.style.display = 'none';
  }

  handlePaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');
    if (pastedText && pastedText.length === 6) {
      this.code1 = pastedText[0];
      this.code2 = pastedText[1];
      this.code3 = pastedText[2];
      this.code4 = pastedText[3];
      this.code5 = pastedText[4];
      this.code6 = pastedText[5];
      event.preventDefault();
    }
  }
}