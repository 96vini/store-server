import { Document } from 'mongoose';

export interface IAddress extends Document {
  street: string;
  number: string;
  complement: string;
  district: string,
  city: string;
  state: string;
  zip_code: string;
  reference: string;
}