import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [ NavbarComponent ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
  providers: [UserService]
})
export class ShoppingCartComponent {

}
