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
  @Input() comment: any;

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
        this.commentForm.get('content')?.setValue(this.post.comments);
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
          console.log(this.contentList);
          return this.contentList;
        });
      },
    });
  }

  addComment(post: any) {
    this.userService
      .addCommentToPost(
        this.token,
        post._id,
        this.commentForm.get('content')?.value
      )
      .subscribe({
        next: (data) => {
          this.userService.saveUser(data);

          const postToStore = {
            ...this.contentList,
            ...data,
          };
          this.store.setUser(postToStore);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
  }
}
