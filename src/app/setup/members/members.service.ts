/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpMemberModel } from './member-model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  url = 'sp-app/trx/sp-member';
  dmlUrl = 'sp-app/trx/member';
  constructor(private http: HttpClient) {}

  findAllSpMember(token: string, spId): Observable<SpMemberModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SpMemberModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}`,
      { headers: headerInfo }
    );
  }

  findSpMemberById(token: string, id): Observable<SpMemberModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SpMemberModel>(
      `${environment.backendUrl}/${this.dmlUrl}/${id}`,
      { headers: headerInfo }
    );
  }

  createSpMember(token: string, body: SpMemberModel): Observable<SpMemberModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.post<SpMemberModel>(
      `${environment.backendUrl}/${this.dmlUrl}`,
      body,
      { headers: headerInfo }
    );
  }
  updateSpMember(token: string, body: SpMemberModel, id): Observable<SpMemberModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<SpMemberModel>(
      `${environment.backendUrl}/${this.dmlUrl}/${id}`,
      body,
      { headers: headerInfo }
    );
  }
  deleteSpMember(token: string, id): Observable<string> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.delete<string>(
      `${environment.backendUrl}/${this.dmlUrl}/${id}`,
      { headers: headerInfo }
    );
  }
}
