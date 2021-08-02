import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { of } from 'rxjs';

import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { UserInfoService } from 'src/app/shared/user-info.service';
import { VehicleModel } from './vehicle-model';
import { VehicleService } from './vehicle.service';
import { VehicleComponent } from './vehicle/vehicle.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.page.html',
  styleUrls: ['./vehicle.page.scss'],
})
export class VehiclePage implements OnInit {
  showSearchbar = false;
  queryText = '';
  ios: boolean;
  vechileList: VehicleModel[] = [];
  authToken: spAuthToken;
  spId;
  loginSp: ServiceProviderModel;
  constructor(
    private service: VehicleService,
    private userInfoService: UserInfoService,
    private loadinCtrl: LoadingController,
    private toast: ToastController,
    private router: Router,
    private modalControl: ModalController
  ) {}

  ngOnInit() {
    this.loadinCtrl
      .create({
        message: 'loading data.. please wait',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.authToken = await readStorage('spAuthData');
        this.userInfoService
          .loadUserInfo('Bearer ' + this.authToken.token, this.authToken.userId)
          .subscribe(
            (userIfo) => {
              this.loginSp = userIfo.sp;
              this.spId = userIfo.sp.id;
              this.service
                .findAllSpVehicle('Bearer ' + this.authToken.token, this.spId)
                .subscribe(
                  (data) => {
                    this.vechileList = data;
                    loadingElmnt.dismiss();
                  },
                  (error) => {
                    loadingElmnt.dismiss();
                    console.log(error);
                  }
                );
            },
            (error) => {
              loadingElmnt.dismiss();
              console.log(error);
            }
          );
      });
  }
  onSearchEvent(event) {
    const query = event.detail.value;
    console.log(query);
    let filteredData;
    if (!query || query.length===0) {
      this.ngOnInit();
    } else {
      filteredData = this.vechileList.filter(
        (row) =>
          row.descAr.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1
      );
      return of(filteredData).subscribe(
        (data) => {
          this.vechileList = data;
          console.log(this.vechileList);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onSearchCancelEvent() {
    of(false).subscribe(
      (data) => {
        this.showSearchbar = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  doRefresh(event) {}
  openModal(vcl: VehicleModel) {
    this.modalControl
      .create({
        component: VehicleComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: vcl,
          serviceProviderId: this.spId,
          recordStatus: 'update',
        },
      })
      .then((modalElement) => {
        modalElement.present();
        modalElement.onDidDismiss().then((dismissData) => {
          if (dismissData.data.saved) {
            this.refreshPage();
            this.showToast('Transaction Saved');
          }
        });
      });
  }

  createRecord() {
    const body = new VehicleModel(
      this.loginSp,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'Y'
    );
    this.modalControl
      .create({
        component: VehicleComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: body,
          serviceProviderId: this.spId,
          recordStatus: 'insert',
        },
      })
      .then((modalElement) => {
        modalElement.present();
        modalElement.onDidDismiss().then((dismissData) => {
          if (dismissData.data.saved) {
            this.refreshPage();
            this.showToast('Transaction Saved');
          }
        });
      });
  }

  refreshPage() {
    this.service
      .findAllSpVehicle('Bearer ' + this.authToken.token, this.spId)
      .subscribe((data) => {
        console.log(data);
        this.vechileList = data;
      });
  }
  returnBack(){
    this.router.navigate(['/','setup-home']);
  }
  private showToast(msg: string) {
    this.toast
      .create({
        message: msg,
        position: 'middle',
        duration: 500,
      })
      .then((toastCtrl) => {
        toastCtrl.present();
      });
  }



}
