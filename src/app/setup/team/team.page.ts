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
import { SpMemberModel } from '../members/member-model';
import { MembersService } from '../members/members.service';
import { VehicleModel } from '../vehicle/vehicle-model';
import { VehicleService } from '../vehicle/vehicle.service';
import { SpTeamModel } from './sp-team-model';
import { SpTeamService } from './sp-team.service';
import { TeamComponent } from './team/team.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {
  showSearchbar = false;
  queryText = '';
  ios: boolean;
  teamList: SpTeamModel[] = [];
  membersList: SpMemberModel[] = [];
  vclList: VehicleModel[] = [];
  authToken: spAuthToken;
  spId;
  loginSp: ServiceProviderModel;
  constructor(
    private service: SpTeamService,
    private userInfoService: UserInfoService,
    public memberService: MembersService,
    public vclService: VehicleService,
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
              // fetch members list
              this.memberService
                .findAllSpMember('Bearer ' + this.authToken.token, this.spId)
                .subscribe((memberData) => {
                  this.membersList = memberData;
                });
              // fetch vcl list
              this.vclService
                .findAllSpVehicle('Bearer ' + this.authToken.token, this.spId)
                .subscribe((vclData) => {
                  this.vclList = vclData;
                });
                // fetch list of teams
              this.service
                .findAllSpTeams('Bearer ' + this.authToken.token, this.spId)
                .subscribe(
                  (data) => {
                    this.teamList = data;
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
      filteredData = this.teamList.filter(
        (row) =>
          row.descAr.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1
      );
      return of(filteredData).subscribe(
        (data) => {
          this.teamList = data;
          console.log(this.teamList);
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
  openModal(team: TeamComponent) {
    this.modalControl
      .create({
        component: TeamComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: team,
          serviceProviderId: this.spId,
          vclList: this.vclList,
          memberList: this.membersList,
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
    const body = new SpTeamModel(
      this.loginSp,
      null,
      null,
      null,
      null,
      null,
      new Date(),
      null,
      'Y',
      null
    );
    this.modalControl
      .create({
        component: TeamComponent,
        cssClass: 'custom-modal',
        componentProps: {
          model: body,
          serviceProviderId: this.spId,
          vclList: this.vclList,
          memberList: this.membersList,
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
      .findAllSpTeams('Bearer ' + this.authToken.token, this.spId)
      .subscribe((data) => {
        console.log(data);
        this.teamList = data;
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
