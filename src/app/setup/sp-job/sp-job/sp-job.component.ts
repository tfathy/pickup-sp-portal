import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { SpJobService } from '../../sp-job.service';
import { SpJobModel } from '../sp-job-model';

@Component({
  selector: 'app-sp-job',
  templateUrl: './sp-job.component.html',
  styleUrls: ['./sp-job.component.scss'],
})
export class SpJobComponent implements OnInit {
  @Input() model: SpJobModel;
  @Input() recordStatus: string;
  @Input() serviceProviderId;
  authToken: spAuthToken;
  constructor(  private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private service: SpJobService) {}

    async ngOnInit() {  this.authToken = await readStorage('spAuthData');}

    save() {
      this.loadingCtrl
        .create({
          message: 'Saving .. please wait',
        })
        .then((loadingElement) => {
          loadingElement.present();
          if (this.recordStatus === 'insert') {
            this.service
              .createSpJob(
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
              .updateSpJob(
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
