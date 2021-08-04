import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../shared/auth.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private loadingCtrl: LoadingController, private authService: AuthService,private router: Router) { }

  ngOnInit() {
  }

  logout() {
    const promise1 = Promise.resolve(Storage.remove({ key: 'authData' }));
    this.loadingCtrl
      .create({
        message: 'log out ..',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        Promise.all([promise1]).then((data) => {
          this.authService.logout();
          this.router.navigateByUrl('/home');
          loadingElmnt.dismiss();
        });
      });
  }
}
