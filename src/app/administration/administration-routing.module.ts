import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "annee-academique", loadChildren: () => import("./components/annee-academique/annee-academique.module").then(m => m.AnneeAcademiqueModule)
  },
  {
    path: "annonce", loadChildren: () => import("./components/annonce/annonce.module").then(m => m.AnnonceModule)
  },
  {
    path:'traiter',loadChildren:()=> import('./components/traite-candidat/traite-candidat.module').then(m => m.TraiteCandidatModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
