import { Routes } from '@angular/router';
import { AlumnosComponent } from '../app/components/alumnos/alumnos.component';
import { CursosComponent } from '../app/components/cursos/cursos.component';
import { InscripcionesComponent } from '../app/components/inscripciones/inscripciones.component';

export const routes: Routes = [
  {
    path: 'alumnos',
    component: AlumnosComponent,
    title: 'Gestión de Alumnos',
  },
  {
    path: 'cursos',
    component: CursosComponent,
    title: 'Gestión de Cursos',
  },
  {
    path: 'inscripciones',
    component: InscripcionesComponent,
    title: 'Gestión de Inscripciones',
  },
  {
    path: '',
    redirectTo: '/alumnos',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/alumnos',
  },
];
