import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule} from '@angular/router';
import { UserService } from '../../../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule, RouterModule, RouterOutlet, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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