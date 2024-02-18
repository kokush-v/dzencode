import { IUserRegistrationSchema, IUserSchema, UserSchema } from '../schemas/user.schema';
import { ERRORS, INDEXES } from '../constants';
import db from '../config/database.config';
import QUEUE from '../queue/list';
import { queue } from '../config/bull.config';

export default class UserService {
  async create(user: IUserRegistrationSchema): Promise<IUserSchema> {
    const createJob = await queue.add(QUEUE.CREATE, { data: user, index: INDEXES.USER });
    const response = await createJob.finished();

    const newUser = UserSchema.parse({ ...user, id: response._id });

    return newUser;
  }

  async findOne(userEmail: string): Promise<IUserSchema> {
    const {
      hits: { hits }
    } = await db.search<IUserSchema>({
      query: {
        match_phrase_prefix: {
          email: userEmail
        }
      }
    });

    if (hits.length === 0) {
      throw ERRORS.NOT_FOUND;
    }

    const user = UserSchema.parse({ id: hits[0]._id, ...hits[0]._source });

    return user;
  }
}
