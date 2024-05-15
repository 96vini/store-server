import mongoose, { Schema } from 'mongoose';

import { IProduct } from '@/interfaces/product';

const ProductSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['object', 't-shirt', 'sneakers'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  quantity: {
    type: Number
  },
  dimensions: {
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export { Product };
