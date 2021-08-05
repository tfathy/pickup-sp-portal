import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { UserInfoService } from 'src/app/shared/user-info.service';
import { CreateUserModel } from './create-user-model';
import { SysOwnerUserModel } from './sys-owner-user-model';
import { UsersService } from './users.service';
import { UsersComponent } from './users/users.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  showSearchbar = false;
  queryText = '';
  ios: boolean;
  userList: SysOwnerUserModel[] = [];
  spAuthToken: spAuthToken;
  sp: ServiceProviderModel;
  spId;
  constructor(
    private service: UsersService,
    private userInfoService: UserInfoService,
    private loadingCtrl: LoadingController,
    private modalControl: ModalController,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'Loading.. please wait',
      })
      .then(async (loadingElement) => {
        loadingElement.present();
        this.spAuthToken = await readStorage('spAuthData');
        this.userInfoService
          .loadUserInfo(
            'Bearer ' + this.spAuthToken.token,
            this.spAuthToken.userId
          )
          .subscribe((userInfoData) => {
            this.sp = userInfoData.sp;
            this.spId = userInfoData.sp.id;
            this.service
              .findAllMembersAccount(
                'Bearer ' + this.spAuthToken.token,
                this.spId
              )
              .subscribe((memberInfoData) => {
                this.userList = memberInfoData;
                console.log(memberInfoData);
                loadingElement.dismiss();
              },error=>{
                loadingElement.dismiss();
                console.log(error);
              });
          },error=>{
            loadingElement.dismiss();
            console.log(error);
          });
      });
  }
  onSearchEvent(event) {
    const query = event.detail.value;
    console.log(query);
    let filteredData;
    if (!query || query.length===0) {
      this.ngOnInit();
    } else {
      filteredData = this.userList.filter(
        (row) =>
          row.email.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1
      );
      return of(filteredData).subscribe(
        (data) => {
          this.userList = data;
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
  returnBack(){
    this.router.navigate(['/','setup-home']);
  }
  openOptions(usr: SysOwnerUserModel){

  }
  /*openModal(usr: SysOwnerUserModel) {
    this.modalControl
      .create({
        component: UsersComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: usr,
          serviceProvider: this.sp,
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
*/
  createRecord() {
    const body =  new CreateUserModel(this.sp,null,null,null,'SP_MEMBER','VERIFIED');
    this.modalControl
      .create({
        component: UsersComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: body,
          serviceProvider: this.sp,
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
      .findAllMembersAccount('Bearer ' + this.spAuthToken.token, this.spId)
      .subscribe((data) => {
        this.userList = data;
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
