import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PostDataI, UserDataI } from 'src/models/interfaces';
import { API_URL } from 'src/config';
import { FormGroup } from '@angular/forms';

const USER_URL = API_URL + 'post/';
const USERPOST_URL = API_URL + 'post';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  imagesList: string[] = [];
  constructor(private http: HttpClient) {}

  getUserProfile(token: string, userId: string): Observable<UserDataI> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get<UserDataI>(USER_URL + userId, httpOptions);
  }
  getAllPosts(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
    return this.http.get(USER_URL, httpOptions).pipe(
      map((data: any) => {
        console.log('y trae.....', data);
        let mergedData = [].concat.apply([], data);
        this.imagesList = mergedData;
        return this.imagesList;
      })
    );
  }

  updateUserProfile(user: UserDataI): Observable<any> {
    console.log('token', user);
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: `Bearer ${user.token}` }),
    };

    return this.http.patch(USER_URL + user.id, user, httpOptions);
  }

  addPhoto(url: any, token: string): Observable<any> {
    console.log('token', url);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
    const body = { url: url };
    console.log('body', url);
    return this.http.post(USERPOST_URL, body, httpOptions);
  }

  deletePost(
    token: string,
    userId: UserDataI,
    idPost: string
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };

    return this.http.delete(USER_URL + userId.id + `/${idPost}`, httpOptions);
  }

  addCommentToPost(user: UserDataI, idPost: string): Observable<UserDataI> {
    console.log('token', user);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      }),
    };
    const body = { commentId: user };
    return this.http.patch<UserDataI>(
      USER_URL + `${idPost}`,
      body,
      httpOptions
    );
  }

  deleteCommentFromPost(
    token: string,
    idPost: string,
    user: UserDataI
  ): Observable<UserDataI> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
    const body = { commentId: user };
    return this.http.patch<UserDataI>(
      USER_URL + `${idPost}`,
      body,
      httpOptions
    );
  }

  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public prepareData(formData: FormGroup): any {
    return {
      username: formData.get('username')?.value,
      profileImage: formData.get('profileImage')?.value,
      posts: [
        formData.get('url')?.value,
        formData.get('comments')?.value,
        formData.get('user')?.value,
      ],
    };
  }
}
