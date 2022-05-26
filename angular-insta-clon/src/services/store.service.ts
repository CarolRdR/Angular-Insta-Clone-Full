import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostDataI, UserDataI } from 'src/models/interfaces';

const initialState: UserDataI = {
  email: '',
  token: '',
  _id: '',
  username: '',
  profileImage: '',
  posts: [],
};

const initialPost: PostDataI = {
  _id: '',
  url: '',
  comments: [{ _id: '', content: '', author_id: { username: '', _id: '' } }],
  user: {
    email: '',
    token: '',
    _id: '',
    username: '',
    profileImage: '',
    posts: [],
  },
};

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private user!: UserDataI;
  private post!: PostDataI;
  user$: BehaviorSubject<UserDataI>;
  post$: BehaviorSubject<PostDataI>;

  fullUserData = {};
  constructor() {
    this.user$ = new BehaviorSubject(initialState);
    this.post$ = new BehaviorSubject(initialPost);
  }

  setUser(user: UserDataI) {
    this.user = user;
    console.log('Ticking next');
    this.user$.next(this.user);
  }
  setImage(post: PostDataI) {
    this.post = post;
    this.post$.next(this.post);
  }

  getUser() {
    return this.user$;
  }
  getImage() {
    return this.post$;
  }

  logoutUser() {
    this.user = initialState;
  }
}
