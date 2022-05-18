import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthLoginI, AuthRegisterI } from 'src/models/interfaces';
import { API_URL } from 'src/config';

const AUTH_API = API_URL + 'auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(user: AuthLoginI): Observable<any> {
    console.log(this.http.post(AUTH_API + 'login', user));
    return this.http.post(AUTH_API + 'login', user, httpOptions);

    // .pipe(
    //   map((user) => {
    //     console.log(user);
    //     // login successful if there's a jwt token in the response
    //     if (user && user) {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       localStorage.setItem('currentUser', JSON.stringify(user));
    //     }

    //     return user;
    //   })
    // );
  }
  loginWithToken(user: AuthLoginI, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };
    return this.http.post(AUTH_API + 'login', user, httpOptions);
  }
  register(user: AuthRegisterI): Observable<any> {
    return this.http.post(AUTH_API + 'register', user);
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(token: string): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
