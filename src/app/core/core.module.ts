import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    DashboardComponent,
  ]
})
export class CoreModule { }
