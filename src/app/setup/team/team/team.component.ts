import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { SpMemberModel } from '../../members/member-model';
import { VehicleModel } from '../../vehicle/vehicle-model';
import { SpTeamModel } from '../sp-team-model';
import { SpTeamService } from '../sp-team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  @Input() model: SpTeamModel;
  @Input() recordStatus: string;
  @Input() serviceProviderId;
  @Input() vclList: VehicleModel[];
  @Input()memberList: SpMemberModel[];

  authToken: spAuthToken;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private service: SpTeamService
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'loading ..please wait'
    }).then(async loadingElemnt=>{
      loadingElemnt.present();
      this.authToken = await readStorage('spAuthData');
      loadingElemnt.dismiss();
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
            .createSpTeam(
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
            .updateSpteam(
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
