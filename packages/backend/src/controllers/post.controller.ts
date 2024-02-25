import { Response } from 'express';

import { CreatePostRequest, GetPostRequest, GetPostsRequestQuery } from '../types/requests.types';
import PostService from '../services/post.service';
import { CreatePostResponse, GetPostResponse, GetPostsResponse } from '../types/responses.types';
import { MESSAGES } from '../constants';
import { IPostSchema, PostCreateShema } from '../schemas/post.schema';
import { IUserSessionSchema } from '../schemas/user.schema';
import { photoUpload } from '../utils/photo.upload';
import { fileUpload } from '../utils/file.upload';
import { redisClient } from '../cache/redis';
import { queueService } from '../queue/bull';
import QUEUES from '../queue/list';

export class PostController {
  private postService: PostService;
  constructor() {
    this.postService = new PostService();
  }

  async create(req: CreatePostRequest, res: Response<CreatePostResponse>) {
    const { text } = req.body;
    const { email, name } = req.user as IUserSessionSchema;
    const file = req.file;

    let fileUrl;

    if (file) {
      fileUrl =
        file?.mimetype.split('/')[0] === 'image' ? await photoUpload(file) : await fileUpload(file);
    }

    const validPost = PostCreateShema.parse({
      userName: name,
      userEmail: email,
      text,
      file: fileUrl
    });

    const newPost = await this.postService.create(validPost);

    res.send({ data: newPost, message: MESSAGES.POST.CREATED });
  }

  async getOne(req: GetPostRequest, res: Response<GetPostResponse>) {
    const { postId } = req.params;
    const post = await this.postService.findOne(postId);
    res.send({ data: post });
  }

  async getMany(req: GetPostsRequestQuery, res: Response<GetPostsResponse>) {
    const { page = 1 } = req.query;

    let postsWithTotal: { data: IPostSchema[]; total: { value: number; relation: string } };
    const cache = await redisClient().get('posts');

    if (cache) {
      postsWithTotal = JSON.parse(cache);
    } else {
      const postJob = await queueService.addJob(QUEUES.POSTS, { page });
      postsWithTotal = await postJob.finished();

      queueService.addJob(QUEUES.CACHE_DATA, { key: 'posts', data: postsWithTotal });
    }

    res.send({
      data: postsWithTotal.data,
      total: postsWithTotal.total.value,
      pages:
        Math.ceil(postsWithTotal.total.value / 10) === 0
          ? 1
          : Math.ceil(postsWithTotal.total.value / 10)
    });
  }
}

const postController = new PostController();

export default postController;
