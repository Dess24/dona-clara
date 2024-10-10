import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';

@Component({
  selector: 'app-abaut-us',
  standalone: true,
  imports: [ NavbarComponent, FooterComponent ],
  templateUrl: './abaut-us.component.html',
  styleUrl: './abaut-us.component.css'
})
export class AbautUsComponent {

}
