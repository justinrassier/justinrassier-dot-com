import { MarkdownComponent, injectContent } from '@analogjs/content';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { Post } from '../../data/posts';

@Component({
  selector: 'post',
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe, NgIf, DatePipe],
  template: `
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
