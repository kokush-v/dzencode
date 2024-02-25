import { IPost } from './post.types';

class PostModel implements IPost {
  id: string;

  userName: string;

  userEmail: string;

  text: string;

  file?: string;

  createdAt: Date;

  replies: IPost[];

  constructor({ id, userName, userEmail, text, file: file, createdAt, replies }: IPost) {
    console.log(text, replies);

    this.id = id;
    this.userName = userName;
    this.userEmail = userEmail;
    this.text = text;
    this.file = file;
    this.createdAt = createdAt;
    this.replies = replies;
  }
}

const createPostModel = (postFromServer: IPost) => {
  const newPost = new PostModel(postFromServer);
  newPost.replies.map((replies) => {
    createPostModel(replies);
  });

  return newPost;
};

export { createPostModel };

export default PostModel;
