import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
  ]
})
export class CoreModule { }
