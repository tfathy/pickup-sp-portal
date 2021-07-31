import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
interface UserExistsModel{
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginPageService {
  url = 'sys-owner-security/owner-auth/check/user';
  constructor(private http: HttpClient) {}

  checkUserExists(username): Observable<UserExistsModel> {
    return this.http.post<UserExistsModel>(`${environment.backendUrl}/${this.url}`,username);
  }
}
