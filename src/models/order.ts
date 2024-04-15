import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { IUser } from './user';
import { IProduct } from './product';

interface IOrder extends Document {
  user: IUser['_id'];
  products: {
    product: IProduct['_id'];
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface ICreateOrderRequest {
  user: IUser['_id'],
  products: {
    product: IProduct['_id'],
    quantity: number
  }[];
  totalAmount: number,
  status: 'pending' | 'completed' | 'cancelled'
}

interface IFindOrderByIdRequest {
  id: ObjectId,
}

interface IFindByUserIDRequest {
  user_id: ObjectId,
}

interface IUpdateStatusOrderRequest {
  id: ObjectId,
}

interface IDeleteOrderRequest {
  id: ObjectId,
}

const OrderSchema: Schema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export {
  Order,
  IOrder,
  ICreateOrderRequest,
  IFindOrderByIdRequest,
  IFindByUserIDRequest,
  IUpdateStatusOrderRequest,
  IDeleteOrderRequest
};
