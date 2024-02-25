export interface IPost {
  id: number;
  userName: string;
  userEmail: string;
  text: string;
  file?: string;
  createdAt: Date;
}

export interface IPostForm extends Omit<IPost, 'id' | 'userName' | 'userEmail' | 'createdAt'> {}

export interface PostFilters {
  search: string;
  filter: '' | 'completed' | 'private';
  page: number;
  maxPages: number;
}
