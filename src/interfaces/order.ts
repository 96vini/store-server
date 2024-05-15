import { ObjectId } from "mongoose";

import { IUser } from "@/interfaces/user";
import { IProduct } from "@/interfaces/product";

export interface IOrder extends Document {
  user: IUser['_id'];
  products: {
    product: IProduct['_id'];
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface ICreateOrderRequest {
  user: IUser['_id'],
  products: {
    product: IProduct['_id'],
    quantity: number
  }[];
  totalAmount: number,
  status: 'pending' | 'completed' | 'cancelled'
}

export interface IFindOrderByIdRequest {
  id: ObjectId,
}

export interface IFindByUserIDRequest {
  user_id: ObjectId,
}

export interface IUpdateStatusOrderRequest {
  id: ObjectId,
}

export interface IDeleteOrderRequest {
  id: ObjectId,
}