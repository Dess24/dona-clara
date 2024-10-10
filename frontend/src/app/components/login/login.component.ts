import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../home/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, HttpClientModule],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    // Aquí puedes verificar si el usuario está logueado
    this.isLoggedIn = !!localStorage.getItem('auth_token'); // Ejemplo simple, ajusta según tu lógica de autenticación
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
}