import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appDirection = 'rtl';
  lang = 'ar';
  toggled = true;
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.setLanguage('ar');
  }
  setLanguage(lang: string) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  change2Arabic() {
    this.setLanguage('ar');
    this.appDirection = 'rtl';
  }
  change2English() {
    this.setLanguage('en');
    this.appDirection = 'ltr';
  }
  onLangChange() {
    //  this.lang = this.toggled ? 'en' : 'ar';
    if (this.toggled) {
      this.change2Arabic();
      this.lang ='ar';
    } else {
      this.change2English();
      this.lang ='en';
    }
    Storage.set({ key: 'lang', value: this.lang }).then((data) => {});
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
