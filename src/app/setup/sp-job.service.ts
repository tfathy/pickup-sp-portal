/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpJobModel } from './sp-job/sp-job-model';

@Injectable({
  providedIn: 'root',
})
export class SpJobService {
  url = 'sp-app/trx/sp-job';
  dmlUrl = 'sp-app/trx/job';
  constructor(private http: HttpClient) {}

  findAllSpJob(token: string, spId): Observable<SpJobModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SpJobModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}`,
      { headers: headerInfo }
    );
  }

  findSpJobById(token: string, id): Observable<SpJobModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SpJobModel>(
      `${environment.backendUrl}/${this.dmlUrl}/${id}`,
      { headers: headerInfo }
    );
  }

  createSpJob(token: string, body: SpJobModel): Observable<SpJobModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.post<SpJobModel>(
      `${environment.backendUrl}/${this.dmlUrl}`,
      body,
      { headers: headerInfo }
    );
  }
  updateSpJob(token: string, body: SpJobModel, id): Observable<SpJobModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<SpJobModel>(
      `${environment.backendUrl}/${this.dmlUrl}/${id}`,
      body,
      { headers: headerInfo }
    );
  }
  deleteSpJob(token: string, id): Observable<string> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.delete<string>(
      `${environment.backendUrl}/${this.dmlUrl}/${id}`,
      { headers: headerInfo }
    );
  }
}
