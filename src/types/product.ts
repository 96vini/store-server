import { IBrand } from '@/interfaces/brand';
import { ICategory } from '@/interfaces/category';

export interface ICreateProductRequest {
  name: string;
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

export interface IUpdateProductRequest {
  id: string;
}

export interface IFindProductByIdRequest {
  id: string;
}

export interface IDeleteProductRequest {
  id: string;
}
