import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupHomePageRoutingModule } from './setup-home-routing.module';

import { SetupHomePage } from './setup-home.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    SetupHomePageRoutingModule
  ],
  declarations: [SetupHomePage]
})
export class SetupHomePageModule {}
