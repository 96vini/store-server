import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  category: 'object' | 't-shirt' | 'sneakers';
  price: number;
  color?: string;
  size?: string;
  quantity?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

interface ICreateProductRequest {
  name: string;
  category: 'object' | 't-shirt' | 'sneakers';
  price: number;
  color?: string;
  size?: string;
  quantity?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  }
}

interface IUpdateProductRequest {
  id: string,
}

interface IFindProductByIdRequest {
  id: string,
}

interface IDeleteProductRequest {
  id: string,
}

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

export { 
  Product, 
  IProduct,
  ICreateProductRequest,
  IUpdateProductRequest,
  IFindProductByIdRequest,
  IDeleteProductRequest
};
