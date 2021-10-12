/* eslint-disable prefer-const */
/* eslint-disable new-parens */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { CountryModel } from '../model/country-model';
import { SubscriptionRequestModel } from '../model/subscribe-request-model';
import { SysOwnerModel } from '../model/sys-owner-model';
import { LookupService } from '../shared/lookup.service';
import { SubscribeRequestService } from './subscribe-request.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { AttachmentService } from '../shared/attachment.service';
import { finalize } from 'rxjs/operators';
import { SubRequestAttachment } from '../model/sub-request-attachment';
const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-subscribe-request',
  templateUrl: './subscribe-request.page.html',
  styleUrls: ['./subscribe-request.page.scss'],
})
export class SubscribeRequestPage implements OnInit {
  form: FormGroup;
  countryList: CountryModel[] = [];
  images: LocalFile[] = [];
  constructor(
    private service: SubscribeRequestService,
    private attachmentService: AttachmentService,
    private lookupService: LookupService,
    private loadingControl: LoadingController,
    private alert: AlertController,
    private toastCtrl: ToastController,
    private plt: Platform,
    private router: Router
  ) {}
  // Helper function
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  ngOnInit() {
    this.loadFiles();
    this.loadingControl
      .create({
        message: 'loading ...please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.lookupService.findCountryByStatus('Y').subscribe(
          (data) => {
            this.countryList = data;
            console.log(data);
            loadingElmnt.dismiss();
          },
          (error) => {
            loadingElmnt.dismiss();
            this.showAlert(error.message.statusText);
          }
        );
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
  async loadFiles() {
    this.images = [];

    const loading = await this.loadingControl.create({
      message: 'Loading data...',
    });
    await loading.present();

    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    })
      .then(
        (result) => {
          this.loadFileData(result.files);
        },
        async (err) => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: Directory.Data,
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      });
  }
  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
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
        this.service.createSubscriptionRequest(model).subscribe(
          (data) => {
            console.log('new id ='+data.id);
            this.images[0].name = data.id+'-'+'0'+'.jpg';
            this.startUpload(this.images[0],'DOC0',data.id);
            this.images[1].name = data.id+'-'+'1'+'.jpg';
            this.startUpload(this.images[1],'DOC1',data.id);
            this.images[2].name = data.id+'-'+'2'+'.jpg';
            this.startUpload(this.images[2],'DOC2',data.id);
            this.images[3].name = data.id+'-'+'3'+'.jpg';
            this.startUpload(this.images[3],'DOC3',data.id);
            this.images[4].name = data.id+'-'+'4'+'.jpg';
            this.startUpload(this.images[4],'DOC4',data.id);
            this.images[5].name = data.id+'-'+'5'+'.jpg';
            this.startUpload(this.images[5],'DOC5',data.id);
            loadingElmnt.dismiss();
            this.router.navigate(['/']);
            this.showAlert(
              'Your Request has been sent. We will contact you soon.'
            );
          },
          (error) => {
            loadingElmnt.dismiss();
            this.showAlert(
              'Error while sending request: error code[' + error.status + ']'
            );
            console.log(error);
          }
        );
      });
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // Camera, Photos or Prompt!
    });

    if (image) {
      this.saveImage(image);
    }
  }
  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
      directory: Directory.Data,
    });

    // Reload the file list
    // Improve by only loading for the new image and unshifting array!
    this.loadFiles();
  }
  async startUpload(file: LocalFile, attachType: string,parentId) {
    let fileInfo: SubRequestAttachment;
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name);
    this.loadingControl
      .create({
        message: 'uploading attachments ... please wait',
      })
      .then((loadingElmnt) => {
        this.attachmentService
          .uploadFile(formData)
          .pipe(
            finalize(() => {
              loadingElmnt.dismiss();
            })
          )
          .subscribe((res) => {
            fileInfo = new SubRequestAttachment(parentId,attachType,res.fileName,res.fileType,res.size);
            this.attachmentService.saveAttchmentData(fileInfo)
            .subscribe(data=>{
              console.log(data);
              this.deleteImage(file);
              loadingElmnt.dismiss();
            });
            console.log('res=',res);
          });
      });
  }
  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
        directory: Directory.Data,
        path: file.path
    });
    this.loadFiles();
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

  private showAlert(msg: string) {
    this.alert
      .create({
        message: msg,
        header: 'Subscription Request',
        buttons: [{ text: 'OK' }],
      })
      .then((alertElement) => {
        alertElement.present();
      });
  }

  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }
  private async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
    });
    toast.present();
  }
}
