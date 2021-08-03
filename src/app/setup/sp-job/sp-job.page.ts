import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  ModalController,
} from '@ionic/angular';
import { of } from 'rxjs';
import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { UserInfoService } from 'src/app/shared/user-info.service';
import { SpJobService } from './sp-job.service';
import { SpJobModel } from './sp-job-model';
import { SpJobComponent } from './sp-job/sp-job.component';

@Component({
  selector: 'app-sp-job',
  templateUrl: './sp-job.page.html',
  styleUrls: ['./sp-job.page.scss'],
})
export class SpJobPage implements OnInit {
  showSearchbar = false;
  queryText = '';
  ios: boolean;
  authToken: spAuthToken;
  sp: ServiceProviderModel;
  spId;

  jobList: SpJobModel[] = [];
  constructor(
    private userInfoService: UserInfoService,
    private service: SpJobService,
    private loadinCtrl: LoadingController,
    private toast: ToastController,
    private router: Router,
    private modalControl: ModalController
  ) {}

  ngOnInit() {
    this.loadinCtrl
      .create({
        message: 'Loading... please wait',
      })
      .then(async (loadingElment) => {
        loadingElment.present();
        this.authToken = await readStorage('spAuthData');
        this.userInfoService
          .loadUserInfo('Bearer ' + this.authToken.token, this.authToken.userId)
          .subscribe((loginInfoData) => {
            this.sp = loginInfoData.sp;
            this.spId = loginInfoData.sp.id;
            this.service
              .findAllSpJob('Bearer ' + this.authToken.token, this.spId)
              .subscribe(
                (spData) => {
                  this.jobList = spData;
                  loadingElment.dismiss();
                },
                (error) => {
                  loadingElment.dismiss();
                  console.log(error);
                }
              );
          },error=>{
            loadingElment.dismiss();
            console.log(error);
          });
      });
  }
  doRefresh(event) {}

  returnBack() {
    this.router.navigate(['/', 'setup-home']);
  }

  onSearchEvent(event) {
    const query = event.detail.value;
    console.log(query);
    let filteredData;
    if (!query || query.length === 0) {
      this.ngOnInit();
    } else {
      filteredData = this.jobList.filter(
        (row) =>
          row.descAr.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1
      );
      return of(filteredData).subscribe(
        (data) => {
          this.jobList = data;
          console.log(this.jobList);
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
  openModal(job: SpJobModel) {
    this.modalControl
      .create({
        component: SpJobComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: job,
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

  refreshPage() {
    this.service
      .findAllSpJob('Bearer ' + this.authToken.token, this.spId)
      .subscribe((data) => {
        console.log(data);
        this.jobList = data;
      });
  }

  createRecord() {
    const body = new SpJobModel(this.sp,null,null,null,null,'Y');
    this.modalControl
      .create({
        component: SpJobComponent,
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
