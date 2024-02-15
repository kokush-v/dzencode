import { User } from '../entities/User.entity';
import { IUser } from '../types/user.type';

export default class UserService {
  async create(user: IUser): Promise<User> {
    const newUser: User = await User.create(Object.assign(user)).save();
    return newUser;
  }

  async findOne(userEmail: string): Promise<User> {
    const existUser = await User.findOneByOrFail({ email: userEmail });
    return existUser;
  }
}
