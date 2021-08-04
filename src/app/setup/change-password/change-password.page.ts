import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { SysOwnerModel } from 'src/app/model/sys-owner-model';
import { ProfileService } from 'src/app/shared/profile.service';
import { readStorage, spAuthToken } from 'src/app/shared/shared-util';
import { SpUserModel } from 'src/app/shared/sp-user-model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePasswordForm;
  model: SysOwnerModel = new SysOwnerModel();
  token: spAuthToken;
  constructor(
    private toast: ToastController,
    private alert: AlertController,
    private loadingCtrl: LoadingController,
    private profileService: ProfileService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.changePasswordForm = new FormGroup({
      oldpwassword: new FormControl('', [Validators.required]),
      newpassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      repeatpassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
    this.token = await readStorage('spAuthData');
  }
  changePassword() {
    if (this.newpassword.value !== this.repeatpassword.value) {
      this.showToast('PASSWORD_MISMATCH');
      return;
    }
    const body: SpUserModel = new SpUserModel();
    this.loadingCtrl
      .create({
        message: 'please wait ...',
      })
      .then(async (elmnt) => {
        elmnt.present();
        this.token = await readStorage('spAuthData');
        body.email = this.token.email;
        this.profileService
          .changePassword(
            'Bearer ' + this.token.token,
            body,
            body.email,
            this.oldpwassword.value,
            this.newpassword.value
          )
          .subscribe(
            (resData) => {
              elmnt.dismiss();
              console.log(resData);
              this.showToast('Password changed successfully');
            },
            (error) => {
              elmnt.dismiss();
              console.log(error);
              this.showAlert(error.error.message);
            }
          );
      });
  }

  get oldpwassword() {
    return this.changePasswordForm.get('oldpwassword');
  }

  get newpassword() {
    return this.changePasswordForm.get('newpassword');
  }

  get repeatpassword() {
    return this.changePasswordForm.get('repeatpassword');
  }

  returnBack(){
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
  private showAlert(msg: string) {
    this.alert
      .create({
        message: msg,
        buttons: [{ text: 'OK' }],
      })
      .then((elmnt) => {
        elmnt.present();
      });
  }
}
