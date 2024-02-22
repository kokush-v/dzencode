import { IPost } from './post.types';

class PostModel implements IPost {
  id: number;

  userName: string;

  userEmail: string;

  text: string;

  file?: string;

  createdAt: Date;

  constructor({ id, userName, userEmail, text, file, createdAt }: IPost) {
    this.id = id;
    this.userName = userName;
    this.userEmail = userEmail;
    this.text = text;
    this.file = file;
    this.createdAt = createdAt;
  }
}

const createPostModel = (postFromServer: IPost) => new PostModel(postFromServer);

export { createPostModel };

export default PostModel;
