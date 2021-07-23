/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CountryModel } from '../model/country-model';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  countryUrl = 'sys-owner-app/public/country';
  constructor(private http: HttpClient) {}

  findCountryByStatus(activeFlag: string): Observable<CountryModel[]> {
    return this.http.get<CountryModel[]>(
      `${environment.backendUrl}/${this.countryUrl}/${activeFlag}`
    );
  }
}
