import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraiteCandidatRoutingModule } from './traite-candidat-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { TraiterCandidatComponent } from './traiter-candidat/traiter-candidat.component';


@NgModule({
  declarations: [
    TraiterCandidatComponent,
  ],
  imports: [
    CommonModule,
    TraiteCandidatRoutingModule,
    SharedModule
  ]
})
export class TraiteCandidatModule { }
