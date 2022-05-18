import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataI } from 'src/models/interfaces';
import { AuthService } from 'src/services/auth.service';
import { StoreService } from 'src/services/store.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  isSuccessful = false;
  isRegisterFailed = false;
  errorMessage = '';
  isVisible: boolean = false;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private store: StoreService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    });
  }
  register(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (data: UserDataI) => {
        this.store.setUser(data);
        this.authService.saveToken(data.token);
        this.userService.saveUser(data);

        if (data) {
          this.isRegisterFailed = false;
          return this.router.navigate(['login']);
        } else {
          this.isRegisterFailed = true;
          return;
        }
      },
      error: (error) => {
        this.errorMessage = error;
        this.isRegisterFailed = true;
      },
    });
  }
}
