import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cart?: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

type CreateUserRequest = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string
  }
}

const UserSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const User = mongoose.model<IUser>('User', UserSchema);

export { User, IUser, CreateUserRequest };