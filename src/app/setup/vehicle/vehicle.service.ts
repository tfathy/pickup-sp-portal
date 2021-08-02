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
  url ='sp-app/trx/sp-vcl';
  vclUrl = 'sp-app/trx/vcl';
  constructor(private http: HttpClient) { }
//fetch all vcl for an sp
  findAllSpVehicle(token: string, spId): Observable<VehicleModel[]>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<VehicleModel[]>(
      `${environment.backendUrl}/${this.url}/${spId}`,
      { headers: headerInfo }
    );
  }

  // return one object by vcl.id
  findByIdSpVehicle(token: string, id): Observable<VehicleModel>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<VehicleModel>(
      `${environment.backendUrl}/${this.vclUrl}/${id}`,
      { headers: headerInfo }
    );
  }

  createSpVehicle(token: string,body: VehicleModel): Observable<VehicleModel>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.post<VehicleModel>(
      `${environment.backendUrl}/${this.vclUrl}`,body,
      { headers: headerInfo }
    );
  }
  updateSpVehicle(token: string,body: VehicleModel,id): Observable<VehicleModel>{
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.put<VehicleModel>(
      `${environment.backendUrl}/${this.vclUrl}/${id}`,body,
      { headers: headerInfo }
    );
  }
}
