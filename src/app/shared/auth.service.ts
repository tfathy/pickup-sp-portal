/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Storage } from '@capacitor/storage';
import { UserModel } from '../model/user-model';

interface AuthResponseData {
  token: string;
  email: string;
  refreshToken: string;
  expires: string;
  userId: string;
  userType?: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{
  private _user = new BehaviorSubject<UserModel>(null);
  private activeLogoutTimer: any;
  constructor(private http: HttpClient) { }


  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  authLogin(loginEmail: string, loginPassword: string) {
    return this.http
    .post<any>(
      `${environment.backendUrl}/sys-owner-security/owner-auth/login`,
      {
        email: loginEmail,
        password: loginPassword,
      },
      { observe: 'response' }
    )
    .pipe(tap(  res =>
     {
      console.log('******User type is');
      console.log(res);
       this.setUserData(res);
     }
      )
      );
  }
  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.userId;
        } else {
          return null;
        }
      })
    );
  }
  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  this._user.next(null);
   Storage.remove({ key: 'spAuthData' });
  }

  autoLogin() {
    return from(Storage.get({ key: 'spAuthData' })).pipe(
      map((storedDate) => {
        if (!storedDate || !storedDate.value) {
          console.log('******** cannot find storage spAuthData***** ');
          return null;
        }
        const parsData = JSON.parse(storedDate.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
          fullNameEn: string;
          fullNameAr: string;
          userType: string;
          accountStatus: string;
        };
        const tokenExpirationTime = new Date(parsData.tokenExpirationDate);
        if (tokenExpirationTime <= new Date()) {
          return null;
        }
        const user = new UserModel(
          parsData.email,
          parsData.userId,
          parsData.fullNameEn,
          parsData.fullNameAr,
          parsData.userType,
          parsData.accountStatus,
          parsData.token,
          tokenExpirationTime
        );
        console.log('User stored is:'+user);
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) =>
         !!user // return true if there is a value in the user object
      )
    );
  }

  private setUserData(userData: HttpResponse<AuthResponseData>) {
    const currentime = new Date().getTime();
    const ms = currentime+ +userData.headers.get('expires') * 1000;

    const expirationTime  = new Date(currentime+ +ms);
    const user = new UserModel(
      userData.headers.get('email'),
      userData.headers.get('userId'),
      userData.headers.get('fullNameEn'),
      userData.headers.get('fullNameAr'),
      userData.headers.get('userType'),
      userData.headers.get('accountStatus'),
      userData.headers.get('token'),
      expirationTime
    );
    this.storeAuthData(
      userData.headers.get('userId'),
      userData.headers.get('token'),
      expirationTime.toISOString(),
      userData.headers.get('email'),
      userData.headers.get('fullNameEn'),
      userData.headers.get('fullNameAr'),
      userData.headers.get('userType')
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
  }

  private   storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    fullnameEn: string,
    fullnameAr: string,
    userType: string
  ) {

    const data = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email,
      fullnameEn,
      fullnameAr,
      userType
    });

      Storage.set({ key: 'spAuthData', value: data });

  }
  private autoLogout(duration: number) {
    console.log('*******autoLogout executed********');
/*   if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);*/
  }



}
