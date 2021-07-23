import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { CountryModel } from '../model/country-model';
import { SubscriptionRequestModel } from '../model/subscribe-request-model';
import { SysOwnerModel } from '../model/sys-owner-model';
import { LookupService } from '../shared/lookup.service';
import { SubscribeRequestService } from './subscribe-request.service';

@Component({
  selector: 'app-subscribe-request',
  templateUrl: './subscribe-request.page.html',
  styleUrls: ['./subscribe-request.page.scss'],
})
export class SubscribeRequestPage implements OnInit {
  form: FormGroup;
  countryList: CountryModel[] =[];
  constructor(
    private service: SubscribeRequestService,
    private lookupService: LookupService,
    private loadingControl: LoadingController,
    private alert: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadingControl.create({
      message: 'loading ...please wait'
    }).then(loadingElmnt=>{
      loadingElmnt.present();
      this.lookupService.findCountryByStatus('Y').subscribe(data=>{
        this.countryList = data;
        console.log(data);
        loadingElmnt.dismiss();
      },error=>{
         loadingElmnt.dismiss();
         this.showAlert(error.message.statusText);
      });
    });

    this.form = new FormGroup({
      address: new FormControl('', [Validators.required]),
      commNumber: new FormControl('', [Validators.required]),
      companyNameAr: new FormControl('', [Validators.required]),
      companyNameEn: new FormControl('', [Validators.required]),
      contactPersonEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      contactPersonName: new FormControl('', [Validators.required]),
      contactPersonPhone: new FormControl('', [Validators.required]),
      gnCountry: new FormControl('', [Validators.required]),
    });
  }

  postRequest() {
    const model = new SubscriptionRequestModel(
      null,
      new Date(),
      'C',
      'E',
      new SysOwnerModel(1),
      this.address.value,
      this.commNumber.value,
      this.companyNameAr.value,
      this.companyNameEn.value,
      this.contactPersonEmail.value,
      this.contactPersonName.value,
      this.contactPersonPhone.value,
      this.gnCountry.value
    );
    this.loadingControl
      .create({
        message: 'Sending request.. please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.service.createSubscriptionRequest(model).subscribe((data) => {
          loadingElmnt.dismiss();
          this.router.navigate(['/']);
          this.showAlert('Your Request has been sent. We will contact you soon. For more information call 1802228');
        },error=>{
          loadingElmnt.dismiss();
          this.showAlert('Error while sending request: error code['+error.status+']');
          console.log(error);
        });
      });
  }
  get address() {
    return this.form.get('address');
  }
  get commNumber() {
    return this.form.get('commNumber');
  }
  get companyNameAr() {
    return this.form.get('companyNameAr');
  }
  get companyNameEn() {
    return this.form.get('companyNameEn');
  }
  get contactPersonEmail() {
    return this.form.get('contactPersonEmail');
  }
  get contactPersonName() {
    return this.form.get('contactPersonName');
  }
  get contactPersonPhone() {
    return this.form.get('contactPersonPhone');
  }
  get gnCountry() {
    return this.form.get('gnCountry');
  }

  private showAlert(msg: string){
    this.alert.create(
      {message: msg,
      header:'Subscription Request',
    buttons:[{text:'OK'}]}
    ).then(alertElement=>{
      alertElement.present();
    });
  }
}
