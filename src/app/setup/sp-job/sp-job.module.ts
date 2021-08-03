import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpJobPageRoutingModule } from './sp-job-routing.module';

import { SpJobPage } from './sp-job.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    SpJobPageRoutingModule
  ],
  declarations: [SpJobPage]
})
export class SpJobPageModule {}
