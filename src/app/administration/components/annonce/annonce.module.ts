import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnonceRoutingModule } from './annonce-routing.module';
import { AnnonceComponent } from './annonce/annonce.component';
import { SharedModule } from '../../../shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    AnnonceComponent,
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
    AnnonceRoutingModule,
    SharedModule
  ]
})
export class AnnonceModule { }
