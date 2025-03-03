import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterOutlet, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Navbar3Component } from '../home/navbar3/navbar3.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, Navbar3Component, ReactiveFormsModule, HttpClientModule, RouterOutlet, RouterModule],
  providers: [UserService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  isLoggedInAdmin: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]], // Campo para teléfono/celular
      domicilio: ['', [Validators.required, Validators.maxLength(30)]] // Campo para domicilio
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      const formData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        password_confirmation: this.registerForm.value.confirmPassword,
        telefono: this.registerForm.value.telefono,
        domicilio: this.registerForm.value.domicilio
      };
      
      const emailDomain = this.registerForm.value.email.split('@')[1];
      if (emailDomain !== 'gmail.com' && emailDomain !== 'hotmail.com' && emailDomain !== 'outlook.com') {
        this.errorMessage = 'El correo electrónico debe ser de dominio válido, por ejemplo @gmail.com';
        return;
      }
      
      this.userService.register(formData).subscribe(
        response => {
          console.log('Registro exitoso', response);
          if (response && response.token) {
            const token = response.token;
            localStorage.setItem('auth_token', token);
            this.router.navigate(['/inicio']);
          } else {
            this.errorMessage = 'Error en el registro: Token no recibido';
            console.error('Error en el registro: Token no recibido', response);
          }
        },
        error => {
          if (error.status === 422) {
            if (error.error.email) {
              this.errorMessage = 'El email ya está ocupado';
            } else if (error.error.telefono) {
              this.errorMessage = 'El teléfono/celular es obligatorio y debe tener 8 o 9 números';
            } else if (error.error.domicilio) {
              this.errorMessage = 'El domicilio es obligatorio y debe tener menos de 100 caracteres';
            } else {
              this.errorMessage = 'Error en el registro';
            }
          } else if (error.status === 500 && error.error.message.includes('No se pudo enviar el correo de bienvenida')) {
            this.errorMessage = 'No se pudo enviar el correo de bienvenida. El usuario ha sido eliminado.';
          } else {
            this.errorMessage = 'Error en el registro';
          }
          console.error('Error en el registro', error);
        }
      );
    }
  }


  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe(response => {
        this.isLoggedInAdmin = !!response.user.admin;
      });
    }
    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe(response => {
        this.isLoggedInAdmin = !!response.user.admin;
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

  modal(){
    const modal = document.getElementById('modal-container') as HTMLElement;
    const hide = document.getElementById('wpp') as HTMLElement;
    modal.style.display = 'flex';
    hide.style.display = 'none';
  }

  modalClose(){
    const modal = document.getElementById('modal-container') as HTMLElement;
    const hide = document.getElementById('wpp') as HTMLElement;
    modal.style.display = 'none';
    hide.style.display = 'flex';
  }
}