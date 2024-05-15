import mongoose, { Schema } from 'mongoose';

import { IUser } from '@/interfaces/user';

const UserSchema: Schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone:  {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: [
    {
      street: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
      complement: {
        type: String,
      },
      district: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip_code: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      }
    }
  ],
});

const User = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };