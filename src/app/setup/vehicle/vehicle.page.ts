import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { of } from 'rxjs';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { VehicleModel } from './vehicle-model';
import { VehicleService } from './vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.page.html',
  styleUrls: ['./vehicle.page.scss'],
})
export class VehiclePage implements OnInit {
  vechileList: VehicleModel[] = [];
  authToken: spAuthToken;
  spId;
  constructor(
    private service: VehicleService,
    private loadinCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadinCtrl
      .create({
        message: 'loading data.. please wait',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.authToken = await readStorage('spAuthData');
        this.service
          .findAllSpVehicle('Bearer ' + this.authToken.token, this.spId)
          .subscribe((data) => {
            this.vechileList = data;
          });
      });
  }

  doRefresh(event) {}
}
