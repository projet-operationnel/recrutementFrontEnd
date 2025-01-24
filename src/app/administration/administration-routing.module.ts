import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "annee-academique", loadChildren: () => import("./components/annee-academique/annee-academique.module").then(m => m.AnneeAcademiqueModule)
  },
  {
    path: "annonce", loadChildren: () => import("./components/annonce/annonce.module").then(m => m.AnnonceModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
