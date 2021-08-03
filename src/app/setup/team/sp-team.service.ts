/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpTeamModel } from './sp-team-model';

@Injectable({
  providedIn: 'root',
})
export class SpTeamService {
  url = 'sp-app/trx/sl-team';
  vclUrl = 'sp-app/trx/team';
  constructor(private http: HttpClient) {}
  //fetch all vcl for an sp
  findAllSpTeams(token: string, spId): Observable<SpTeamModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SpTeamModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}`,
      { headers: headerInfo }
    );
  }

  // return one object by vcl.id
  findByIdSpTeam(token: string, id): Observable<SpTeamModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SpTeamModel>(
      `${environment.backendUrl}/${this.vclUrl}/${id}`,
      { headers: headerInfo }
    );
  }

  createSpTeam(token: string, body: SpTeamModel): Observable<SpTeamModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.post<SpTeamModel>(
      `${environment.backendUrl}/${this.vclUrl}`,
      body,
      { headers: headerInfo }
    );
  }
  updateSpteam(
    token: string,
    body: SpTeamModel,
    id
  ): Observable<SpTeamModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<SpTeamModel>(
      `${environment.backendUrl}/${this.vclUrl}/${id}`,
      body,
      { headers: headerInfo }
    );
  }
}
