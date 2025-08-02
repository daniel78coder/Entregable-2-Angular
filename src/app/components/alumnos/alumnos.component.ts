import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../shared/services/data.service';
import { Alumno } from '../../shared/models/models';
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
  selector: 'app-alumnos',
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
  templateUrl: './alumnos.component.html',
})
export class AlumnosComponent implements OnInit {
  dataSource = new MatTableDataSource<Alumno>([]);
  alumnoForm: FormGroup;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'email',
    'telefono',
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
    this.alumnoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,}$/)]],
    });
  }

  ngOnInit(): void {
    this.loadAlumnos();
  }

  loadAlumnos(): void {
    this.dataService.getAlumnos().subscribe((alumnos) => {
      this.dataSource.data = alumnos;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const alumnoData = this.alumnoForm.value;

      if (this.editingId) {
        this.dataService
          .updateAlumno({ ...alumnoData, id: this.editingId })
          .subscribe({
            next: () => {
              this.snackBar.open('Alumno actualizado', 'Cerrar', {
                duration: 3000,
              });
              this.resetForm();
              this.loadAlumnos();
            },
            error: (error) => {
              this.snackBar.open('Error al actualizar', 'Cerrar');
              console.error(error);
            },
          });
      } else {
        this.dataService.addAlumno(alumnoData).subscribe({
          next: () => {
            this.snackBar.open('Alumno creado', 'Cerrar', { duration: 3000 });
            this.resetForm();
            this.loadAlumnos();
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
    this.alumnoForm.reset();
    this.editingId = null;
    this.showForm = false;
  }

  verDetalle(alumno: Alumno): void {
    const detalle = `ID: ${alumno.id}
Nombre: ${alumno.nombre}
Apellido: ${alumno.apellido}
Email: ${alumno.email}
Teléfono: ${alumno.telefono}`;
    alert(detalle);
  }

  editarAlumno(alumno: Alumno): void {
    this.editingId = alumno.id;
    this.alumnoForm.patchValue({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      email: alumno.email,
      telefono: alumno.telefono,
    });
    this.showForm = true;
  }

  eliminarAlumno(alumno: Alumno): void {
    if (confirm(`¿Eliminar a ${alumno.nombre} ${alumno.apellido}?`)) {
      this.dataService.deleteAlumno(alumno.id).subscribe({
        next: () => {
          this.snackBar.open('Alumno eliminado', 'Cerrar', { duration: 3000 });
          this.loadAlumnos();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar', 'Cerrar');
          console.error(error);
        },
      });
    }
  }
}
