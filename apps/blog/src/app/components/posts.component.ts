import { ContentFile } from '@analogjs/content';
import { DatePipe, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Post } from '../data/posts';

@Component({
  selector: 'posts',
  standalone: true,
  imports: [NgFor, RouterLink, DatePipe],
  template: `
    <div class="grid grid-cols-1 grid-rows[min-content_1fr] h-full p-8">
      <div class="text-center">
        <h1 class="text-5xl text-gray-700">Blog Posts</h1>
      </div>
      <div class="text-2xl justify-self-center">
        <ul class="py-4" *ngFor="let post of posts">
          <li>
            <a
              [routerLink]="['/blog', 'posts', post.attributes.slug]"
              class="text-gray-600"
              >{{ post.attributes.title }}</a
            >
            <p class="text-sm">
              {{ post.attributes.publishedDate | date : 'MMMM dd, yyyy' }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class PostsComponent {
  @Input() posts: ContentFile<Post>[] = [];
}
