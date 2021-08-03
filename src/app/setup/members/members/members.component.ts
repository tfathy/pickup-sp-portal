import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { SpJobModel } from '../../sp-job/sp-job-model';
import { SpJobService } from '../../sp-job/sp-job.service';
import { SpMemberModel } from '../member-model';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  @Input() model: SpMemberModel;
  @Input() recordStatus: string;
  @Input() serviceProviderId;
  jobList: SpJobModel[]=[];
  authToken: spAuthToken;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private service: MembersService,
    private spJopService: SpJobService
  ) {}

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'loading ..please wait'
    }).then(async loadingElemnt=>{
      loadingElemnt.present();
      this.authToken = await readStorage('spAuthData');
      this.spJopService.findAllSpJob('Bearer '+this.authToken.token,this.serviceProviderId).subscribe( resData=>{
        this.jobList = resData;
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
            .createSpMember(
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
            .updateSpMember(
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
    this.model.terminatedFlag = 'Y';
    this.recordStatus = 'update';
    this.save();
  }
  enableRecord() {
    this.model.terminatedFlag = 'N';
    this.recordStatus = 'update';
    this.save();
  }

}
