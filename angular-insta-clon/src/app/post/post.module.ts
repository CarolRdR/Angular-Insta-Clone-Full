import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post/post.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [PostComponent],
  imports: [CommonModule, PostRoutingModule, CoreModule],
})
export class PostModule {}
