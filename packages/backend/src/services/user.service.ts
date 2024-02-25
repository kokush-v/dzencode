import { UserRegistrationSchema, UserSchema } from '../schemas/user.schema';
import { ERRORS, INDEXES } from '../constants';
import db from '../config/database';

// TODO: implement db.queries with elasticsearch

export default class UserService {
  async create(user: UserRegistrationSchema): Promise<UserSchema> {
    const response = await db.index({
      index: INDEXES.USER,
      document: user
    });

    const newUser = UserSchema.parse({ ...user, id: response._id });

    return newUser;
  }

  async findOne(userEmail: string): Promise<UserSchema> {
    const {
      hits: { hits }
    } = await db.search<UserSchema>({
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
