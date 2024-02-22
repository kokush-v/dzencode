import { PostFilters } from '../types/todo/post.types';

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
