import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { LoginComponent } from 'src/app/home/login/login.component';
import { VehicleComponent } from 'src/app/setup/vehicle/vehicle/vehicle.component';

@NgModule({
  declarations: [LoginComponent, VehicleComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    TranslateModule,
  ],
  exports:[
    LoginComponent,
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicSelectableModule,
    VehicleComponent
  ]
})
export class SharedModule {}
