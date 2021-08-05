import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { SpMemberModel } from '../../members/member-model';
import { MembersService } from '../../members/members.service';
import { CreateUserModel } from '../create-user-model';
import { SysOwnerUserModel } from '../sys-owner-user-model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @Input() model: CreateUserModel;
  @Input() recordStatus: string;
  @Input() serviceProvider;
  memberList: SpMemberModel[] = [];
  authToken: spAuthToken;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private service: UsersService,
    private memberService: MembersService
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'loading ..please wait',
      })
      .then(async (loadingElemnt) => {
        loadingElemnt.present();
        this.authToken = await readStorage('spAuthData');
        this.memberService
          .findAllSpMember(
            'Bearer ' + this.authToken.token,
            this.serviceProvider.id
          )
          .subscribe(
            (membersData) => {
              this.memberList = membersData;
              loadingElemnt.dismiss();
            },
            (error) => {
              loadingElemnt.dismiss();
              console.log(error);
            }
          );
      });
  }

  save() {
    this.loadingCtrl
      .create({
        message: 'Saving .. please wait',
      })
      .then((loadingElement) => {
        loadingElement.present();
        this.model.sp = this.serviceProvider;
        if (this.recordStatus === 'insert') {
          this.service
            .createMemberUser('Bearer ' + this.authToken.token, this.model)
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
            .updateMemberUser('Bearer ' + this.authToken.token, this.model)
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
  onEmpSelect() {
    console.log('event fired');
    console.log(this.model.member.fullNameAr);
    this.model.email = this.model.member.email;
  }

  close() {
    this.modalCtrl.dismiss({
      saved: false,
    });
  }
  disableRecord() {
    this.model.accountStatus = 'N';
    this.recordStatus = 'update';
    this.save();
  }
  enableRecord() {
    this.model.accountStatus = 'Y';
    this.recordStatus = 'update';
    this.save();
  }
}
