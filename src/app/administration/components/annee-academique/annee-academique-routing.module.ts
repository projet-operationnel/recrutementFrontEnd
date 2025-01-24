import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnneeAcademiqueComponent } from './annee-academique/annee-academique.component';

const routes: Routes = [
  {
    path: '',component:AnneeAcademiqueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnneeAcademiqueRoutingModule { }
