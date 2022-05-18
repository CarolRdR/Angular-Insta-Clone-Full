import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualPostComponent } from './individual-post/individual-post/individual-post.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  {
    path: 'post/url',
    component: IndividualPostComponent,
    pathMatch: 'full',
  },
  {
    path: 'post/:id',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'community',
    loadChildren: () => import('./post/post.module').then((m) => m.PostModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
