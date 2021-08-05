/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceProviderModel } from 'src/app/model/service-provider-model';
import { environment } from 'src/environments/environment';
import { CreateUserModel } from './create-user-model';
import { SysOwnerUserModel } from './sys-owner-user-model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url = 'sys-owner-security/owner-auth/members-account'; // to get list of users of type sp-member for te sp
  manageUserUrl = 'sys-owner-security/owner-auth';
  constructor(private http: HttpClient) {}

  findAllMembersAccount(token: string, spId): Observable<SysOwnerUserModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SysOwnerUserModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}`,
      { headers: headerInfo }
    );
  }

  createMemberUser(
    token: string,
    body: CreateUserModel
  ): Observable<SysOwnerUserModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });

    return this.http.post<SysOwnerUserModel>(
      `${environment.backendUrl}/${this.manageUserUrl}`,
      body,
      { headers: headerInfo }
    );
  }

  updateMemberUser(
    token: string,
    body: CreateUserModel
  ): Observable<SysOwnerUserModel> {
    return null;
  }
}
