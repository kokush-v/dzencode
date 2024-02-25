import { PostFilterEnum, PostOrderEnum } from '../../components/post/post.enums';

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
  reCaptcha: string;
}

export interface PostFilters {
  sort: PostFilterEnum;
  order: PostOrderEnum;
  page: number;
  maxPages: number;
}
