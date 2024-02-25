import { Response } from 'express';

import {
  CreatePostRequest,
  GetPostRequest,
  GetPostsRequestQuery,
  ReplyPostRequest
} from '../types/requests.types';
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
import { OrderValues, SortValues } from '../types/enums';

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

    Object.values(SortValues).map((sort) => {
      Object.values(OrderValues).map((order) => {
        redisClient().del(`post:${sort}:${order}`);
      });
    });

    res.send({ data: newPost, message: MESSAGES.POST.CREATED });
  }

  async getOne(req: GetPostRequest, res: Response<GetPostResponse>) {
    const { postId } = req.params;
    const post = await this.postService.findOne(postId);
    res.send({ data: post });
  }

  async getMany(req: GetPostsRequestQuery, res: Response<GetPostsResponse>) {
    const { page = 1, sort = SortValues.DATE, order = OrderValues.ASC } = req.query;

    let postsWithTotal: { data: IPostSchema[]; total: { value: number; relation: string } };
    const cache = await redisClient().get(`post:${sort}:${order}`);

    if (cache) {
      postsWithTotal = JSON.parse(cache);
    } else {
      const postJob = await queueService.addJob(QUEUES.POSTS, { page, sort, order });
      postsWithTotal = await postJob.finished();

      queueService.addJob(QUEUES.CACHE_DATA, {
        key: `post:${sort}:${order}`,
        data: postsWithTotal
      });
    }

    const pageSize = 25;

    res.send({
      data: postsWithTotal.data,
      total: postsWithTotal.total.value,
      pages:
        Math.ceil(postsWithTotal.total.value / pageSize) === 0
          ? 1
          : Math.ceil(postsWithTotal.total.value / pageSize)
    });
  }
  async reply(req: ReplyPostRequest, res: Response<CreatePostResponse>) {
    const { text } = req.body;
    const { postId } = req.params;
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
      file: fileUrl,
      parent: postId
    });

    const newPost = await this.postService.create(validPost);

    Object.values(SortValues).map((sort) => {
      Object.values(OrderValues).map((order) => {
        redisClient().del(`post:${sort}:${order}`);
      });
    });

    res.send({ data: newPost, message: MESSAGES.POST.CREATED });
  }
}

const postController = new PostController();

export default postController;
