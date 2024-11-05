import { Component } from '@angular/core';
import { NavbarComponent } from '../home/navbar/navbar.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-restore',
  standalone: true,
  imports: [ NavbarComponent ],
  templateUrl: './restore.component.html',
  styleUrl: './restore.component.css',
  providers: [UserService]
})
export class RestoreComponent {

  modal() {
    const modal = document.getElementById('container-modal3') as HTMLElement;
    modal.style.display = 'flex';
  }
  
  modalClose() {
    const modal = document.getElementById('container-modal3') as HTMLElement;
    modal.style.display = 'none';
  }

}
