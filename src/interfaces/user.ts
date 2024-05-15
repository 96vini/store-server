import { Document } from 'mongoose';
import { IAddress } from '@/interfaces/address';

export interface IUser extends Document {
  first_name: string;
  middle_name: string;
  last_name: string;
  document: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  addresses: {
    address: IAddress['_id'],
    name: string,
    description: string,
  }[];
}

export interface ICreateUserRequest {
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  phone: string;
  password: string;
  addresses: string;
  avatar_url: string;
}

