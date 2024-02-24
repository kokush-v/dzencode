import PostModel from '../types/todo/post.model';
import { IPost, PostFilters } from '../types/todo/post.types';

export const debounce = <T extends any[]>(func: (...args: T) => void, delay: number) => {
  let timeoutId: number;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const buildQueryString = (params: PostFilters) =>
  Object.entries(params)
    .filter(([key, value]) => value !== '' && key !== 'maxPages')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

export const insertNestedPost = (posts: PostModel[], insertPost: IPost) => {
  return posts?.map((post) => {
    if (post.id === insertPost.parent) {
      post?.replies?.push(new PostModel(insertPost));
    } else {
      insertNestedPost(post.replies, insertPost);
    }

    return post;
  });
};

export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
