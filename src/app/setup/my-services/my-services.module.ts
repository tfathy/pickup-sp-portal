import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyServicesPageRoutingModule } from './my-services-routing.module';

import { MyServicesPage } from './my-services.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    MyServicesPageRoutingModule
  ],
  declarations: [MyServicesPage]
})
export class MyServicesPageModule {}
