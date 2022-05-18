import { Component, OnInit } from '@angular/core';

import { PostDataI, UserDataI } from 'src/models/interfaces';
import { StoreService } from 'src/services/store.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  token: string;
  userData!: UserDataI;
  errorMessage: string;
  postsList!: Array<PostDataI>;

  constructor(public userService: UserService, public store: StoreService) {
    this.token = '';
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('auth-token') as string;

    this.store.getUser().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }

  getUsersPosts(): void {
    this.userService.getAllPosts(this.token).subscribe((data) => {
      this.postsList = data;
      console.log(this.postsList);

      // .filter(
      //   (item) =>
      //     !this.userData.userFound.posts?.some(
      //       (e: any) => item._id === e._id
      //     ) && item._id !== this.userData.id
      // );
    });
  }

  addComment(id: any) {}
}
