import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post/post.component';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PostModule {}
