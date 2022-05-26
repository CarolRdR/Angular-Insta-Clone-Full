import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

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
  idPost!: string;
  idComment!: string;
  commentForm!: FormGroup;
  userData!: UserDataI;
  errorMessage: string;
  postsList!: PostDataI[];
  post!: PostDataI;
  contentComments: any;

  constructor(
    public userService: UserService,
    public store: StoreService,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.token = '';
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      content: [''],
    });

    this.token = localStorage.getItem('auth-token') as string;

    this.store.getUser().subscribe({
      next: (data) => {
        this.userData = data;

        this.commentForm
          .get('content')
          ?.setValue(this.post.comments[0].content);
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });

    this.userService.getAllPosts(this.token).subscribe({
      next: (data) => {
        this.postsList = data;
        console.log(this.postsList);

        this.postsList.map((item: any) => {
          this.post = item;
          console.log(this.post);

          return this.post;
        });
      },
    });
  }
  addComment(idPost: any) {
    this.userService
      .addCommentToPost(this.token, idPost, {
        comments: [
          {
            content: this.commentForm.get('content')?.value,
            author_id: this.userData,
            _id: '',
          },
        ],

        _id: '',
        url: '',
        user: this.userData,
      })
      .subscribe({
        next: (data) => {
          const postToStore: UserDataI = {
            ...this.postsList,
            ...data,
          };
          this.store.setUser(postToStore);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
    window.location.reload();
  }

  deleteComment(author_id: string) {
    this.userService
      .deleteCommentFromPost(
        this.token,
        this.post._id,
        this.post.comments[0]._id
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
    // window.location.reload();
  }
}
