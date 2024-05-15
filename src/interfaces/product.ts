import { Document } from 'mongoose';

import { IBrand } from '@/interfaces/brand';
import { ICategory } from '@/interfaces/category';

export interface IProduct extends Document {
  name: string;
  description: string;
  brand: IBrand['_id'];
  category: ICategory['_id'];
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

export interface ICreateProductRequest {
  name: string;
  description: string;
  brand: IBrand['_id'];
  category: ICategory['_id'];
  price: number;
  color?: string;
  size?: string;
  quantity?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  },
}

export interface IUpdateProductRequest {
  id: IProduct['_id'];
  name: string;
  description: string;
  brand: IBrand['_id'];
  category: ICategory['_id'];
  price: number;
  color?: string;
  size?: string;
  quantity?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  },
}

export interface IFindProductByIdRequest {
  id: IProduct['_id'];
}

export interface IDeleteProductRequest {
  id: IProduct['_id'];
}