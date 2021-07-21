import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscribeRequestPageRoutingModule } from './subscribe-request-routing.module';

import { SubscribeRequestPage } from './subscribe-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscribeRequestPageRoutingModule
  ],
  declarations: [SubscribeRequestPage]
})
export class SubscribeRequestPageModule {}
