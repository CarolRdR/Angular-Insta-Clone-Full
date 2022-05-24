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
  // @Input() comment: any;

  token: string;
  commentForm!: FormGroup;
  userData!: UserDataI;
  errorMessage: string;
  postsList!: PostDataI[];
  post!: PostDataI;
  contentComments: any;

  commentList: any = [];
  url!: string | undefined;
  user!: UserDataI;
  processing = false;

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

        // this.commentList = this.postsList.map((item: any) => {

        //   this.contentComments = item.comments;

        //   return this.contentComments;

        // });
      },
    });
  }
  addComment(id: any) {
    this.userService
      .addCommentToPost(this.token, {
        comments: [
          {
            content: this.commentForm.get('content')?.value,
            author_id: this.userData,
          },
        ],

        _id: '',
        url: '',
        user: this.userData,
      })
      .subscribe({
        next: (data) => {
          console.log(data);
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
    // window.location.reload();
  }

  deleteComment(idComment: string) {
    this.userService.deleteCommentFromPost(this.token, idComment).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error: any) => {
        this.errorMessage = error;
      },
    });
  }
}
