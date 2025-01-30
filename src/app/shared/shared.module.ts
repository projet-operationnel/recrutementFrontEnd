import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './component/loader/loader.component';


@NgModule({
  declarations: [
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ReactiveFormsModule,
    LoaderComponent,
  ]
})
export class SharedModule { }
