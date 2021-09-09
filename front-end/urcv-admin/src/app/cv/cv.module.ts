import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CvRoutingModule } from './cv-routing.module';
import { GetComponent } from './get/get.component';
import { UploadCvComponent } from './upload-cv/upload-cv.component';
import { UpdateCvComponent } from './update-cv/update-cv.component';


@NgModule({
  declarations: [
    GetComponent,
    UploadCvComponent,
    UpdateCvComponent
  ],
  imports: [
    CommonModule,
    CvRoutingModule
  ]
})
export class CvModule { }
