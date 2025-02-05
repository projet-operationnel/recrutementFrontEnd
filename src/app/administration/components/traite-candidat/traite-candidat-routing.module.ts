import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraiterCandidatComponent } from './traiter-candidat/traiter-candidat.component';

const routes: Routes = [
  {
    path: '', component: TraiterCandidatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraiteCandidatRoutingModule { }
