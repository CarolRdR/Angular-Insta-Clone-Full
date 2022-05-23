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
  contentList: any = [];
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
        console.log('image', data);
        this.commentForm
          .get('content')
          ?.setValue(this.post.comments[0].content);
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });

    // this.store.getImage().subscribe({
    //   next: (data) => {
    //     this.post = data;
    //     console.log('image', data);
    //   },
    //   error: (error) => {
    //     this.errorMessage = error;
    //   },
    // });

    this.userService.getAllPosts(this.token).subscribe({
      next: (data) => {
        this.postsList = data;
        console.log(this.postsList);

        // .filter((item) => item.url);

        // this.postsList.forEach((item) => {
        //   this.contentList = item.comments.filter((item) => item.content);
        //   console.log('lista', this.contentList);
        //   return this.contentList;
        // });
      },
    });
  }
  addComment(id: any) {
    // const inputComment = this.commentForm.value;
    this.userService
      .addCommentToPost(this.token, id, {
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
            ...this.contentList,
            ...data,
          };
          this.store.setUser(postToStore);

          // const commentToStore: PostDataI = {
          //   ...this.post,
          //   ...data,
          // };
          // this.store.setImage(commentToStore);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
  }

  deleteComment(idPost: string, idComment: string) {
    this.userService
      .deleteCommentFromPost(this.token, idPost, idComment)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
  }
}
