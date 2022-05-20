import { Component, Input, OnInit } from '@angular/core';
import { PostDataI, UserDataI } from 'src/models/interfaces';
import { StoreService } from 'src/services/store.service';
import { UserService } from 'src/services/user.service';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() nameToShow!: string | undefined;
  @Input() imageToShow!: string | undefined;

  ref!: AngularFireStorageReference;
  task!: AngularFireUploadTask;

  profileUserForm!: FormGroup;
  postId: string;
  userId!: string;
  token: string;
  errorMessage: string;
  loggedUserData!: UserDataI;
  userData!: UserDataI;
  profileData!: string;
  profileImage!: string;
  profileId!: string;
  postsUserData!: PostDataI;
  downloadableURL: string | undefined = undefined;
  imageToUploadList: string[] = [];
  imageList: PostDataI[] = [];
  userList: string[] = [];
  active = false;
  open = false;

  constructor(
    public store: StoreService,
    public userService: UserService,
    public storageFirebase: AngularFireStorage,
    public router: Router
  ) {
    this.token = '';
    this.postId = '';
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('auth-token') as string;

    this.store
      .getUser()
      .subscribe((ObservableData: any) => console.log({ ObservableData }));

    this.store.getUser().subscribe({
      next: (data) => {
        this.loggedUserData = data;

        const { username, profileImage, posts, _id, token, email } =
          this.loggedUserData;
        this.profileData = username;
        this.profileImage = profileImage;
        this.profileId = _id;

        posts.map((item) => {
          this.imageList.push(item);
          this.userList.push(item['user']);

          console.log('lista', this.imageList);
          return this.imageList;
        });
      },
    });
  }

  toggleActiveProfile() {
    this.active = !this.active;
  }
  toggleActivePosts() {
    this.open = !this.open;
  }

  fileHandlerProfile(event: any) {
    const file = event.target.files[0];

    const randomId = Math.random().toString(36).substring(2);
    if (file) {
      const filePath = `UserProfile/${randomId}${file.name}`;

      // this.progress = this.snapTask.percentageChanges();
      this.storageFirebase.upload(filePath, file).then((data) => {
        data.ref.getDownloadURL().then((url) => {
          this.downloadableURL = url;
          console.log('url', this.downloadableURL);
          document
            .getElementsByClassName('user-data__image-preview')[0]
            .setAttribute('src', this.downloadableURL);
        });
      });
    } else {
      alert('No images selected');
      this.downloadableURL = '';
    }
  }
  fileHandlerPosts(event: any) {
    const file = event.target.files[0];
    console.log('file', file);
    const randomId = Math.random().toString(36).substring(2);
    if (file) {
      const filePath = `UserPosts/${randomId}${file.name}`;

      // this.progress = this.snapTask.percentageChanges();
      this.storageFirebase.upload(filePath, file).then((data) => {
        data.ref.getDownloadURL().then((url) => {
          this.downloadableURL = url;

          this.imageToUploadList.push(this.downloadableURL);
          // document
          //   .getElementsByClassName('user-data__post-preview')[0]
          //   .setAttribute('src', this.downloadableURL);
        });
      });
    } else {
      alert('No images selected');
      this.downloadableURL = '';
    }
  }

  saveProfile(): void {
    this.userService
      .updateUserProfile({
        token: this.loggedUserData.token,
        _id: this.loggedUserData._id,
        email: this.loggedUserData.email,
        username: this.loggedUserData.username,
        profileImage: this.downloadableURL!,
        posts: this.loggedUserData.posts,
      })
      .subscribe({
        next: (data) => {
          this.userService.saveUser(data);

          const userToStore: UserDataI = {
            ...this.loggedUserData,
            ...data,
          };

          this.store.setUser(userToStore);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
  }

  uploadImage(): void {
    this.userService.addPhoto(this.downloadableURL!, this.token).subscribe({
      next: (data) => {
        this.userService.saveUser(this.imageToUploadList);

        const postToStore: UserDataI = {
          ...this.loggedUserData,
          ...data,
        };

        this.store.setUser(postToStore);
      },
      error: (error: any) => {
        this.errorMessage = error;
      },
    });
  }

  imagePost() {
    this.router.navigate([`post/url`]);
  }

  deletePost(post: any): void {
    this.userService.deletePost(this.token, this.profileId, post).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }
}
