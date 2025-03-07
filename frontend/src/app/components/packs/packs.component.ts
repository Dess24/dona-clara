import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Navbar3Component } from '../home/navbar3/navbar3.component';
import { FooterComponent } from '../home/footer/footer.component';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, Navbar3Component, FooterComponent],
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.css'],
  providers: [ProductoService]
})
export class PacksComponent implements OnInit {
  ofertaForm: FormGroup;

  constructor(private productoService: ProductoService, private fb: FormBuilder) {
    this.ofertaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      user_id: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      productos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Inicializar cualquier dato necesario
  }

  get productos(): FormArray {
    return this.ofertaForm.get('productos') as FormArray;
  }

  agregarProducto() {
    const productoForm = this.fb.group({
      producto_id: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
    this.productos.push(productoForm);
  }

  eliminarProducto(index: number) {
    this.productos.removeAt(index);
  }

  crearOferta() {
    if (this.ofertaForm.valid) {
      this.productoService.crearOferta(this.ofertaForm.value).subscribe(
        response => {
          console.log('Oferta creada exitosamente', response);
        },
        error => {
          console.error('Error al crear la oferta', error);
        }
      );
    } else {
      console.error('Formulario de oferta no es válido');
    }
  }
}