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
  profileData!: string;
  profileImage!: string;
  postsUserData!: PostDataI;
  downloadableURL: string | undefined = undefined;
  imageToUploadList: string[] = [];
  imageList: string[] = [];
  active = false;
  open = false;

  constructor(
    public store: StoreService,
    public userService: UserService,
    public storageFirebase: AngularFireStorage
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
        const { username, profileImage } = this.loggedUserData;
        this.profileData = username;
        this.profileImage = profileImage;
        this.loggedUserData = data.userFound.posts.map((item) => {
          this.imageList.push(item['url']);

          return this.imageList;
        }) as any;
        console.log('getuser', this.loggedUserData);
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
    console.log('file', file);
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

          // this.imageToUploadList.push(this.downloadableURL);
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
        id: this.loggedUserData.id,
        email: this.loggedUserData.email,
        username: this.loggedUserData.userFound.username,
        profileImage: this.downloadableURL!,
        userFound: {
          username: this.loggedUserData.userFound.username,
          profileImage: this.downloadableURL!,
          posts: this.loggedUserData.userFound.posts,
        },
        // token: this.loggedUserData.token,
        // id: this.loggedUserData.id,
        // email: this.loggedUserData.email,
        // userFound: this.userService.prepareData(this.profileUserForm),
      })
      .subscribe({
        next: (data) => {
          this.userService.saveUser(data);
          console.log(data);
          const userToStore: UserDataI = {
            ...this.loggedUserData,
            userFound: {
              ...data,
            },
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
          userFound: {
            ...data,
          },
        };

        this.store.setUser(postToStore);
      },
      error: (error: any) => {
        this.errorMessage = error;
      },
    });
  }

  deletePost(): void {
    this.userService.deletePost(this.token, this.postId).subscribe({
      next: (data) => {},
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }
}
