import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule} from '@angular/router';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-navbar2',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, HttpClientModule, MainComponent],
  templateUrl: './navbar2.component.html',
  styleUrl: './navbar2.component.css'
})
export class Navbar2Component {
  isLoggedIn: boolean = false;
  isLoggedInAdmin: boolean = false;

  constructor(private router: Router, private userService: UserService) {}



  modal(){
    const modal = document.getElementById('modal-container') as HTMLElement;
    modal.style.display = 'flex';
  }

  modalClose(){
    const modal = document.getElementById('modal-container') as HTMLElement;
    modal.style.display = 'none';
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
}
