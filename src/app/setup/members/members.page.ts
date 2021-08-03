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
import { SpMemberModel } from './member-model';
import { MembersService } from './members.service';
import { MembersComponent } from './members/members.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {
  showSearchbar = false;
  queryText = '';
  ios: boolean;
  authToken: spAuthToken;
  sp: ServiceProviderModel;
  spId;
  memberList: SpMemberModel[] = [];

  constructor(
    private userInfoService: UserInfoService,
    private service: MembersService,
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
              this.sp = userIfo.sp;
              this.spId = userIfo.sp.id;
              this.service
                .findAllSpMember('Bearer ' + this.authToken.token, this.spId)
                .subscribe(
                  (data) => {
                    this.memberList = data;
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
    if (!query || query.length === 0) {
      this.ngOnInit();
    } else {
      filteredData = this.memberList.filter(
        (row) =>
          row.fullNameAr
            .toLocaleLowerCase()
            .indexOf(query.toLocaleLowerCase()) > -1
      );
      return of(filteredData).subscribe(
        (data) => {
          this.memberList = data;
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
  openModal(spMember: SpMemberModel) {
    this.modalControl
      .create({
        component: MembersComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: spMember,
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
    const body = new SpMemberModel(
      this.sp,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'N'
    );
    this.modalControl
      .create({
        component: MembersComponent,
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
      .findAllSpMember('Bearer ' + this.authToken.token, this.spId)
      .subscribe((data) => {
        this.memberList = data;
      });
  }
  returnBack() {
    this.router.navigate(['/', 'setup-home']);
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
