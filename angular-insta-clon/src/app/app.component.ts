import { Component } from '@angular/core';
import { AuthLoginI, UserDataI } from 'src/models/interfaces';
import { AuthService } from 'src/services/auth.service';
import { StoreService } from 'src/services/store.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-insta-clon';
  errorMessage!: '';
  isLoggedIn!: boolean;

  constructor(
    public userService: UserService,
    public auth: AuthService,
    public store: StoreService
  ) {}

  ngOnInit(): void {
    const token = this.auth.getToken('auth-token');
    this.isLoggedIn = token ? true : false;
    if (this.isLoggedIn) {
      this.auth.loginWithToken({} as AuthLoginI, token as string).subscribe({
        next: (data: UserDataI) => {
          this.store.setUser(data);
        },
        error: (error: any) => {
          this.errorMessage = error;
        },
      });
    }
  }
}
