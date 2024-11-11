import { Component } from '@angular/core';
import { Navbar2Component } from '../home/navbar2/navbar2.component';
import { FooterComponent } from '../home/footer/footer.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-abaut-us',
  standalone: true,
  imports: [ Navbar2Component, FooterComponent ],
  templateUrl: './abaut-us.component.html',
  styleUrl: './abaut-us.component.css',
  providers: [UserService]
})
export class AbautUsComponent {

}
