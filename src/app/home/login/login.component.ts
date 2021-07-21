import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private modal: ModalController) { }

  ngOnInit() {}

  forgetPasswordAction(){

  }
  loginAction(){
    this.modal.dismiss({
      login: true
    });
  }

  closeModal(){
    this.modal.dismiss({
      login: false
    });
  }


}