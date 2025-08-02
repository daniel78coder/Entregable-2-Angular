import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../shared/services/data.service';
import { Curso } from '../../shared/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './cursos.component.html',
})
export class CursosComponent implements OnInit {
  dataSource = new MatTableDataSource<Curso>([]);
  cursoForm: FormGroup;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'duracion',
    'precio',
    'acciones',
  ];
  searchText = '';
  showForm = false;
  editingId: number | null = null;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.cursoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      duracion: ['', [Validators.required, Validators.min(1)]],
      precio: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadCursos();
  }

  loadCursos(): void {
    this.dataService.getCursos().subscribe((cursos) => {
      this.dataSource.data = cursos;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      const cursoData = this.cursoForm.value;

      if (this.editingId) {
        this.dataService
          .updateCurso({ ...cursoData, id: this.editingId })
          .subscribe({
            next: () => {
              this.snackBar.open('Curso actualizado', 'Cerrar', {
                duration: 3000,
              });
              this.resetForm();
              this.loadCursos();
            },
            error: (error) => {
              this.snackBar.open('Error al actualizar', 'Cerrar');
              console.error(error);
            },
          });
      } else {
        this.dataService.addCurso(cursoData).subscribe({
          next: () => {
            this.snackBar.open('Curso creado', 'Cerrar', { duration: 3000 });
            this.resetForm();
            this.loadCursos();
          },
          error: (error) => {
            this.snackBar.open('Error al crear', 'Cerrar');
            console.error(error);
          },
        });
      }
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.cursoForm.reset();
    this.editingId = null;
    this.showForm = false;
  }

  verDetalle(curso: Curso): void {
    const detalle = `ID: ${curso.id}
Nombre: ${curso.nombre}
Descripción: ${curso.descripcion}
Duración: ${curso.duracion} horas
Precio: $${curso.precio}`;
    alert(detalle);
  }

  editarCurso(curso: Curso): void {
    this.editingId = curso.id;
    this.cursoForm.patchValue({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      duracion: curso.duracion,
      precio: curso.precio,
    });
    this.showForm = true;
  }

  eliminarCurso(curso: Curso): void {
    if (confirm(`¿Eliminar el curso "${curso.nombre}"?`)) {
      this.dataService.deleteCurso(curso.id).subscribe({
        next: () => {
          this.snackBar.open('Curso eliminado', 'Cerrar', { duration: 3000 });
          this.loadCursos();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar', 'Cerrar');
          console.error(error);
        },
      });
    }
  }
}
