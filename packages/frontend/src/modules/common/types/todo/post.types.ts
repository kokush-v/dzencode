export interface IPost {
  id: string;
  userName: string;
  userEmail: string;
  text: string;
  file?: string;
  createdAt: Date;
  replies: IPost[];
  parent?: string;
}

export interface IPostForm
  extends Omit<IPost, 'id' | 'userName' | 'userEmail' | 'createdAt' | 'file' | 'replies'> {
  file?: File;
}

export interface PostFilters {
  search: string;
  filter: '' | 'completed' | 'private';
  page: number;
  maxPages: number;
}
