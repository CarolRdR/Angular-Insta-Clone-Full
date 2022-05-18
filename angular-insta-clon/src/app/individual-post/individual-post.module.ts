import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualPostComponent } from './individual-post/individual-post.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [IndividualPostComponent],
  imports: [CommonModule, RouterModule],
})
export class IndividualPostModule {}
