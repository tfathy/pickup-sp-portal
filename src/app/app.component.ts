import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appDirection ='ltr';
  constructor(private translate: TranslateService) {
    this.setLanguage('en');
  }
  setLanguage(lang: string){
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  change2Arabic(){
    this.setLanguage('ar');
    this.appDirection='rtl';
  }
  change2English(){
    this.setLanguage('en');
    this.appDirection ='ltr';
  }
}
