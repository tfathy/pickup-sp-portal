/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceProviderModel } from '../model/service-provider-model';

interface IUserInfo{
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  userId: string;
  userType: string;
  sp: ServiceProviderModel;
  accountStatus: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
url ='sys-owner-security/owner-auth';
  constructor(private http: HttpClient) { }


  // return the user information sored on the database by userid
  loadUserInfo(token: string,userid): Observable<IUserInfo>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
   return this.http.get<IUserInfo>(`${environment.backendUrl}/${this.url}/${userid}`,{headers: headerInfo});
  }
}
