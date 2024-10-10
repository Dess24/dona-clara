import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { FooterComponent } from '../home/footer/footer.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent {

}
