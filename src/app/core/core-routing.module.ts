import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RoleGuard } from '../helpers/guard/role/role.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'administration',
        loadChildren: () =>
          import('../administration/administration.module').then((m) => m.AdministrationModule),
        canActivate: [RoleGuard], // Appliquer le guard
        data: { expectedRole: 'ADMIN' } // Rôle attendu pour accéder à cette route
      },
      {
        path: 'candidat',
        loadChildren: () =>
          import('../candidat/candidat.module').then((m) => m.CandidatModule),
        canActivate: [RoleGuard], // Appliquer le guard
        data: { expectedRole: 'CANDIDAT' } // Rôle attendu pour accéder à cette route
      },
      {
        path: '', redirectTo: 'administration', pathMatch: 'full'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }