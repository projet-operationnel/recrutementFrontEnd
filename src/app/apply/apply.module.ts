import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyRoutingModule } from './apply-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplyComponent } from './components/apply/apply.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ApplyComponent
  ],
  imports: [
    CommonModule,
    ApplyRoutingModule,
    SharedModule
  ]
})
export class ApplyModule { }
