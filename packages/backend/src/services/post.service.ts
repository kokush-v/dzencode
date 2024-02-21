import { INDEXES } from '../constants';
import db from '../config/database.config';
import { IPostCreateSchema, IPostSchema, PostSchema } from '../schemas/post.schema';
import { queueService } from '../queue/bull';
import QUEUES from '../queue/list';

export default class PostService {
  async create(post: IPostCreateSchema): Promise<IPostSchema> {
    const createJob = await queueService.addJob(QUEUES.CREATE, { data: post, index: INDEXES.POST });
    const response = await createJob.finished();
    const newPost = PostSchema.parse({ ...post, id: response._id });

    return newPost;
  }

  async findOne(postId: string): Promise<IPostSchema> {
    const { _source } = await db.get<IPostSchema>({
      index: INDEXES.POST,
      id: postId
    });

    console.log(_source);
    return {} as IPostSchema;
  }
}
