import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  contentList: any[] = [];
  url!: string | undefined;
  user!: UserDataI;
  processing = false;

  constructor(
    public userService: UserService,
    public store: StoreService,
    private fb: FormBuilder
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

    this.store.getImage().subscribe({
      next: (data) => {
        this.post = data;
        console.log('data', data);
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });

    this.userService.getAllPosts(this.token).subscribe({
      next: (data) => {
        this.postsList = [...data];

        this.postsList.forEach((item) => {
          this.contentList = item.comments;

          return this.contentList;
        });
      },
    });
  }

  addComment(id: any) {
    // const inputComment = ev.target.value;
    this.userService
      .addCommentToPost(this.token, id, {
        comments: [
          {
            content: this.commentForm.get('content')?.value,
            author_id: this.userData.username,
          },
        ],

        _id: '',
        url: '',
        user: this.userData,
      })
      .subscribe({
        next: (data) => {
          this.userService.saveUser(data);

          const postToStore: UserDataI = {
            ...this.contentList,
            ...data,
          };
          this.store.setUser(postToStore);

          const commentToStore: PostDataI = {
            ...this.post,
            ...data,
          };
          this.store.setImage(commentToStore);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
  }
}
