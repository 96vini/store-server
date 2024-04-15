import { IUser, User } from '@/models/user';

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
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      email: storedUser.email,
      password: storedUser.password,
      address: storedUser.address ? storedUser.address : [],
      cart: storedUser.cart ? storedUser.cart : []
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
