import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { VehicleSizeModel } from 'src/app/model/vehicle-size-model';
import { LookupService } from 'src/app/shared/lookup.service';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { VehicleModel } from '../vehicle-model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit {
  @Input() model: VehicleModel;
  @Input() recordStatus: string;
  @Input() serviceProviderId;
  vclSizeList: VehicleSizeModel[]=[];
  authToken: spAuthToken;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private service: VehicleService,
    private lookupService: LookupService
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'loading ..please wait'
    }).then(async loadingElemnt=>{
      loadingElemnt.present();
      this.authToken = await readStorage('spAuthData');
      this.lookupService.findAllVclSize('Bearer '+this.authToken.token).subscribe( resData=>{
        this.vclSizeList = resData;
        loadingElemnt.dismiss();

      },error=>{
        loadingElemnt.dismiss();
        console.log(error);
      });

    });
  }

  save() {
    this.loadingCtrl
      .create({
        message: 'Saving .. please wait',
      })
      .then((loadingElement) => {
        loadingElement.present();
        if (this.recordStatus === 'insert') {
          this.service
            .createSpVehicle(
              'Bearer ' + this.authToken.token,
              this.model
            )
            .subscribe(
              (data) => {
                loadingElement.dismiss();
                this.modalCtrl.dismiss({
                  saved: true,
                });
              },
              (error) => {
                loadingElement.dismiss();
                console.log(error);
              }
            );
        } else if (this.recordStatus === 'update') {
          this.service
            .updateSpVehicle(
              'Bearer ' + this.authToken.token,
              this.model,
              this.model.id
            )
            .subscribe(
              (data) => {
                loadingElement.dismiss();
                this.modalCtrl.dismiss({
                  saved: true,
                });
              },
              (error) => {
                loadingElement.dismiss();
                console.log(error);
              }
            );
        }
      });
  }

  close() {
    this.modalCtrl.dismiss({
      saved: false,
    });
  }
  disableRecord() {
    this.model.activeFlag = 'N';
    this.recordStatus = 'update';
    this.save();
  }
  enableRecord() {
    this.model.activeFlag = 'Y';
    this.recordStatus = 'update';
    this.save();
  }
}
