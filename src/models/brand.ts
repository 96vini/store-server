import mongoose, { Schema } from 'mongoose';

import { IBrand } from '@/interfaces/brand';

const BrandSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Brand = mongoose.model<IBrand>('Brand', BrandSchema);

export { Brand };
