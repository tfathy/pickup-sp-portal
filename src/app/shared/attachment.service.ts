import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubRequestAttachment } from '../model/sub-request-attachment';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private uploadUrl = 'sys-owner-app/file/upload';
  private subRequestUrl = 'sys-owner-app/public/sub-request-attach';
  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    console.log('formData=', formData);
    return this.http.post(
      `${environment.backendUrl}/${this.uploadUrl}`,
      formData
    );
  }

  saveAttchmentData(
    body: SubRequestAttachment
  ): Observable<SubRequestAttachment> {
    return this.http.post<SubRequestAttachment>(
      `${environment.backendUrl}/${this.subRequestUrl}`,
      body
    );
  }
}
