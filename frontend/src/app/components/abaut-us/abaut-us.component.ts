import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-abaut-us',
  standalone: true,
  imports: [ NavbarComponent, FooterComponent ],
  templateUrl: './abaut-us.component.html',
  styleUrl: './abaut-us.component.css',
  providers: [UserService]
})
export class AbautUsComponent {

}
