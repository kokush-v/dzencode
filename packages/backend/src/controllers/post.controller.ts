import { Response } from 'express';

import { CreatePostRequest, GetPostRequest } from '../types/requests.types';
import PostService from '../services/post.service';
import { CreatePostResponse, GetPostResponse } from '../types/responses.types';
import { MESSAGES } from '../constants';
import { PostCreateShema } from '../schemas/post.schema';
import { IUserSessionSchema } from '../schemas/user.schema';
import { photoUpload } from '../utils/photo.upload';

export class PostController {
  private postService: PostService;
  constructor() {
    this.postService = new PostService();
  }

  async createPost(req: CreatePostRequest, res: Response<CreatePostResponse>) {
    const { text } = req.body;
    const { email, name } = req.user as IUserSessionSchema;
    const file = req.file;

    const fileUrl = await photoUpload(file);

    const validPost = PostCreateShema.parse({
      userName: name,
      userEmail: email,
      text,
      file: fileUrl
    });

    const newPost = await this.postService.create(validPost);

    res.send({ data: newPost, message: MESSAGES.POST.CREATED });
  }

  async getPost(req: GetPostRequest, res: Response<GetPostResponse>) {
    const { postId } = req.params;
    const post = await this.postService.findOne(postId);
    res.send({ data: post, message: MESSAGES.POST.CREATED });
  }
}

const postController = new PostController();

export default postController;
