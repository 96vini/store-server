import mongoose, { Schema } from 'mongoose';

import { ICategory } from '@/interfaces/category';

const CategorySchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export { Category };
