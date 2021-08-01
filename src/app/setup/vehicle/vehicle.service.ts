/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VehicleModel } from './vehicle-model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  url ='trx/sp-vcl';
  constructor(private http: HttpClient) { }

  findAllSpVehicle(token: string, spId): Observable<VehicleModel[]>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<VehicleModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}`,
      { headers: headerInfo }
    );
  }

  findByIdSpVehicle(token: string, spId,id): Observable<VehicleModel[]>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<VehicleModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}/${id}`,
      { headers: headerInfo }
    );
  }

  createSpVehicle(token: string, spId): Observable<VehicleModel[]>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.post<VehicleModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}`,
      { headers: headerInfo }
    );
  }
  updateSpVehicle(token: string, spId,id): Observable<VehicleModel[]>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.put<VehicleModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}/${id}`,
      { headers: headerInfo }
    );
  }
}
