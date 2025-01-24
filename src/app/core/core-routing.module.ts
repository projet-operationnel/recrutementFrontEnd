import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'administration',
        loadChildren: () =>
          import('../administration/administration.module').then((m) => m.AdministrationModule),
      },
      {
        path: 'candidat',
        loadChildren: () =>
          import('../candidat/candidat.module').then((m) => m.CandidatModule),
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





