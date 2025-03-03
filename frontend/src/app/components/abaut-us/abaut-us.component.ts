import { Component } from '@angular/core';
import { Navbar3Component } from '../home/navbar3/navbar3.component';
import { FooterComponent } from '../home/footer/footer.component';
import { UserService } from '../../services/user.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-abaut-us',
  standalone: true,
  imports: [Navbar3Component ],
  templateUrl: './abaut-us.component.html',
  styleUrl: './abaut-us.component.css',
  providers: [UserService]
})
export class AbautUsComponent {

  constructor(private router: Router) { }

  moveTo(section: string) {
    // Navega a la ruta "/inicio"
    this.router.navigate(['/inicio']).then(() => {
      // Después de navegar, desplázate a la sección
      const element = document.getElementById(section);
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  }

}
