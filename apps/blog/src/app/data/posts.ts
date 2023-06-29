import { injectContentFiles } from '@analogjs/content';

export interface Post {
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string;
}

export function injectPosts() {
  return injectContentFiles<Post>();

  // console.log('foo', foo);
  // return foo;
  // .filter((post) => post.attributes.published)
  // .sort(
  //   (a, b) =>
  //     new Date(b.attributes.publishedDate).valueOf() -
  //     new Date(a.attributes.publishedDate).valueOf()
  // );
}
