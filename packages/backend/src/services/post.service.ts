import { INDEXES } from '../constants';
import db from '../config/database.config';
import { IPostCreateSchema, IPostSchema, PostSchema } from '../schemas/post.schema';
import { queueService } from '../queue/bull';
import QUEUES from '../queue/list';
import { getNestedReplies } from '../utils';

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

    const post = PostSchema.parse(_source);

    return post;
  }

  async findMany(
    page: number
  ): Promise<{ data: IPostSchema[]; total: { value: number; relation: string } }> {
    try {
      const size = 25;

      const {
        hits: { hits, total }
      } = await db.search<IPostSchema>({
        index: INDEXES.POST,
        size,
        from: (page - 1) * size,
        query: {
          bool: {
            must_not: {
              exists: {
                field: 'parent'
              }
            }
          }
        }
      });

      return {
        data: await Promise.all(
          hits.map(async (hit) => {
            const replies = await getNestedReplies(hit._id);
            return PostSchema.parse({
              id: hit._id,
              replies,
              ...hit._source
            });
          })
        ),
        total: total?.valueOf() as { value: number; relation: string }
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.localeCompare('index_not_found_exception') === 1) {
          return {
            data: [],
            total: { value: 0, relation: '' }
          };
        }
      }
      throw error;
    }
  }

  async findReplies(postId: string): Promise<IPostSchema[]> {
    try {
      const {
        hits: { hits }
      } = await db.search<IPostSchema>({
        index: INDEXES.POST,
        query: {
          match_phrase_prefix: {
            parent: postId
          }
        }
      });

      return hits.map((hit) => {
        return PostSchema.parse({
          id: hit._id,
          ...hit._source
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.localeCompare('index_not_found_exception') === 1) {
          return [];
        }
      }
      throw error;
    }
  }
}
