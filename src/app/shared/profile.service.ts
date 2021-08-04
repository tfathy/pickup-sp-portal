/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SysOwnerModel } from '../model/sys-owner-model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  url = 'sys-owner-security/owner-auth/change-pw';
  constructor(private http: HttpClient) { }

  changePassword(
    token: string,
    body: SysOwnerModel,
    email: string,
    oldpassword: string,
    newpassword: string
  ): Observable<SysOwnerModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<SysOwnerModel>(
      `${environment.backendUrl}/${this.url}/${email}/${oldpassword}/${newpassword}`,
      body,
      { headers: headerInfo }
    );
  }
}
