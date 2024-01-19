import { MarkdownComponent, injectContent } from '@analogjs/content';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Post } from '../../data/posts';

@Component({
  selector: 'post',
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe, NgIf, DatePipe, RouterLink],
  template: `
    <a class=" pt-2 pl-2 flex items-center gap-2" [routerLink]="'/blog'">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </div>
      <span>Back to posts</span>
    </a>
    <div
      class="flex flex-grow justify-center min-h-screen"
      *ngIf="post$ | async as post"
    >
      <article
        class="w-screen max-w-4xl p-8 prose prose-lg [&_h2]:text-gray-700"
      >
        <h1 class="text-gray-700 text-4xl">{{ post.attributes.title }}</h1>

        <span class="font-light text-sm">
          {{ post.attributes.publishedDate | date : 'MMMM dd, yyyy' }}
        </span>

        <analog-markdown [content]="post.content"></analog-markdown>
      </article>
    </div>
  `,
})
export default class BlogPostComponent {
  post$ = injectContent<Post>();

  constructor() {}
}
