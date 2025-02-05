import { Routes } from '@angular/router';
import { notRetainAuthGuard } from './helpers/guard/NoteRetainAuth/not-retain-auth.guard';
import { authGuard } from './helpers/guard/Auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
     canActivate: [notRetainAuthGuard]
  },
  {
    path: '', loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
    canActivate: [authGuard]
  },

  {
    path: "**", redirectTo: ""
  }
];
