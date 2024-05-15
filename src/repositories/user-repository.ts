import { User } from '@/models/user';
import { IUser } from '@/interfaces/user';

import mongoose from 'mongoose';

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  findOneById(id: string | mongoose.Types.ObjectId[]): Promise<IUser>;
  findOneByUsername(username: string): Promise<IUser>;
  findOneByEmail(email: string): Promise<IUser>;
}

class UserRepository implements IUserRepository {
  
  async create(user: IUser) {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
  }

  async findAll() {
    const users = await User.find().exec();
    return users;
  }

  async findOneById(id: string | mongoose.Types.ObjectId[]): Promise<IUser> {

    const storedUser = await User.findOne(
      { id },
      {
        projection: {
          _id: 1,
          name: 1,
          email: 1,
          username: 1,
          avatar_url: 1
        }
      }
    ).lean();

    const user = {
      id: storedUser._id,
      first_name: storedUser.first_name,
      last_name: storedUser.last_name,
      username: storedUser.username,
      password: storedUser.password,
      addresses: storedUser.addresses ? storedUser.addresses : [],
    } as IUser;

    return user;
  }

  async findOneByUsername(username: string): Promise<IUser> {
    const user = await User.findOne({ username }).exec();
    return user;
  }

  async findOneByEmail(email: string): Promise<IUser> {
    const user = await User.findOne({ email }).exec();
    return user;
  }

}

export default new UserRepository();
