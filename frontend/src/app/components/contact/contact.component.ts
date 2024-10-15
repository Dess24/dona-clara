import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  providers: [UserService]
})
export class ContactComponent {

}
