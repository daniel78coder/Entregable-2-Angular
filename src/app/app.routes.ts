import { Routes } from '@angular/router';
import { AlumnosComponent } from '../app/components/alumnos/alumnos.component';
import { CursosComponent } from '../app/components/cursos/cursos.component';
import { InscripcionesComponent } from '../app/components/inscripciones/inscripciones.component';
import { LoginComponent } from '../app/components/login/login.component';
import { authGuard } from '../app/authGuard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión',
  },
  {
    path: 'alumnos',
    component: AlumnosComponent,
    title: 'Gestión de Alumnos',
    canActivate: [authGuard],
  },
  {
    path: 'cursos',
    component: CursosComponent,
    title: 'Gestión de Cursos',
    canActivate: [authGuard],
  },
  {
    path: 'inscripciones',
    component: InscripcionesComponent,
    title: 'Gestión de Inscripciones',
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
