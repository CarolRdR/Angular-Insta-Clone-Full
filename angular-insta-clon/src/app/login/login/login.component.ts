import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataI } from 'src/models/interfaces';
import { AuthService } from 'src/services/auth.service';
import { StoreService } from 'src/services/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  isVisible: boolean = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  userInfo = {};
  token: string;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public authService: AuthService,
    public storeService: StoreService
  ) {
    this.token = '';
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('auth-token') as string;
    this.userInfo = this.storeService.getUser();
  }
  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        this.authService.saveToken(data.token);
        this.storeService.setUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.router.navigate([`post/${data.id}`]);
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoginFailed = true;
      },
    });
  }
}
