import mongoose, { Schema } from "mongoose";

import { IAddress } from '@/interfaces/address';

const AddressSchema: Schema = new mongoose.Schema({
  street: {
    type: 'string',
    required: true,
  },
  number: {
    type: 'string',
    required: true,
  },
  complement: {
    type: 'string',
  },
  district: {
    type: 'string',
    required: true,
  },
  city: {
    type: 'string',
    required: true,
  },
  state: {
    type: 'string',
    required: true,
  },
  country: {
    type: 'string',
    required: true,
  }
});

const Address = mongoose.model<IAddress>('address', AddressSchema);

export { Address };