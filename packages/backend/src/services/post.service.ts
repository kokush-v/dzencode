import { INDEXES } from '../constants';
import db from '../config/database.config';
import { IPostCreateSchema, IPostSchema, PostSchema } from '../schemas/post.schema';
import QUEUE from '../queue/list';
import { queue } from '../config/bull.config';

export default class PostService {
  async create(post: IPostCreateSchema): Promise<IPostSchema> {
    const createJob = await queue.add(QUEUE.CREATE, { post, index: INDEXES.USER });
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
