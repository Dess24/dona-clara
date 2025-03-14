import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterOutlet, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Navbar3Component } from '../home/navbar3/navbar3.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterOutlet, RouterModule, Navbar3Component],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoggedIn: boolean = false;
  isLoggedInAdmin: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Aquí puedes verificar si el usuario está logueado
    this.isLoggedIn = !!localStorage.getItem('auth_token'); // Ejemplo simple, ajusta según tu lógica de autenticación
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

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.userService.login(formData).subscribe(
        response => {
          console.log('Login exitoso', response);
          localStorage.setItem('auth_token', response.token); // Guarda el token en el almacenamiento local
          this.isLoggedIn = true;
          this.router.navigate(['/inicio']);
        },
        error => {
          if (error.status === 401) {
            this.errorMessage = 'Detalles de inicio de sesión inválidos';
          } else {
            this.errorMessage = 'Error en el inicio de sesión';
          }
          console.error('Error en el inicio de sesión', error);
        }
      );
    }
  }

  logout(): void {
    this.userService.logout().subscribe(
      response => {
        console.log('Logout exitoso', response);
        localStorage.removeItem('auth_token'); // Elimina el token del almacenamiento local
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error en el logout', error);
      }
    );
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