import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { AuthService } from 'src/app/shared/auth.service';
import { LoginPageService } from './login-page.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(
    private modal: ModalController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private loginPageService: LoginPageService,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  forgetPasswordAction() {
    if (this.form.get('username').invalid) {
      this.showAlert('Please Enter your user name first', 'Error');
      return;
    }
    // check if this username exists
    this.loadingCtrl
      .create({
        message: 'Checking your email address ... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.loginPageService.checkUserExists(this.username.value).subscribe(
          (resData) => {
            //send new password
            this.showAlert(
              'A New password is sent.Please Check your email inbox',
              'Confirmation'
            );
            loadingElmnt.dismiss();
          },
          (error) => {
            this.showAlert(error.message.statusText, 'Error');
            loadingElmnt.dismiss();
          }
        );
      });
  }
  loginAction() {
    this.loadingCtrl
      .create({
        message: 'Log in .... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.authService
          .authLogin(this.username.value, this.password.value)
          .subscribe(
            (loginResponse) => {
              loadingElmnt.dismiss();
              this.modal.dismiss({
                login: true,
              });
            },
            (error) => {
              loadingElmnt.dismiss();
              console.log(error);
              this.modal.dismiss({
                login: false,
              });
            }
          );
      });
  }

  closeModal() {
    this.modal.dismiss({
      login: false,
    });
  }
  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  private showAlert(messageText: string, headerText: string) {
    this.alert
      .create({
        header: headerText,
        message: messageText,
        cssClass: 'notification-alert',
        buttons: ['OK'],
      })
      .then((alertElmnt) => {
        alertElmnt.present();
      });
  }
}
