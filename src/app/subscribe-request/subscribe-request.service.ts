/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubscriptionRequestModel } from '../model/subscribe-request-model';

@Injectable({
  providedIn: 'root',
})
export class SubscribeRequestService {
  url = 'sys-owner-app/public/sub-request';
  constructor(private http: HttpClient) {}

  createSubscriptionRequest(
    body: SubscriptionRequestModel
  ): Observable<SubscriptionRequestModel> {
    return this.http.post<SubscriptionRequestModel>(
      `${environment.backendUrl}/${this.url}`,
      body
    );
  }
}
