import { injectContentFiles } from '@analogjs/content';
import { isDevMode } from '@angular/core';

export interface Post {
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string;
}

export function injectPosts() {
  if (isDevMode()) {
    return injectContentFiles<Post>();
  }
  return injectContentFiles<Post>()
    .filter((post) => post.attributes.published)
    .sort(
      (a, b) =>
        new Date(b.attributes.publishedDate).valueOf() -
        new Date(a.attributes.publishedDate).valueOf()
    );
}
