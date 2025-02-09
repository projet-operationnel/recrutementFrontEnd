import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnneeAcademiqueRoutingModule } from './annee-academique-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AnneeAcademiqueComponent } from './annee-academique/annee-academique.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AnneeAcademiqueComponent
  ],
  imports: [
    CommonModule,
    AnneeAcademiqueRoutingModule,
    FormsModule,
    SharedModule,
  ]
})
export class AnneeAcademiqueModule { }
