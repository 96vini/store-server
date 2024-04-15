import { Order, IOrder } from '@/models/order';
import mongoose, { ObjectId } from 'mongoose';

interface Location {
  coordinates: number[];
  radius: number;
}

export interface IOrderRepository {
  findAll(): Promise<mongoose.Document[]>;
  findOneById(id: ObjectId): Promise<mongoose.Document>;
  findByUserId(user_id: ObjectId): Promise<mongoose.Document[]>;
  findByLocation(location: Location): Promise<mongoose.Document[]>;
  create(order: IOrder): Promise<mongoose.Document>;
  update(id: string, updatedOrder: IOrder): Promise<mongoose.Document>;
  delete(id: string): Promise<void>;
}

class OrderRepository implements IOrderRepository {

  async findAll() {
    const orders = await Order.find().exec();

    return orders;
  }

  async findOneById(id: ObjectId) {
    const order = await Order.findById(id).sort({ created_at: -1 }).exec();
    return order;
  }

  async findByUserId(user_id: ObjectId) {
    const orders = await Order.find({
      user: {
        id: user_id
      }
    }).sort({ created_at: -1 }).exec();
    return orders;
  }

  async findByLocation(location: Location) {
    const orders = await Order.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          $maxDistance: location.radius
        }
      }
    })
    .sort({ created_at: -1 })
    .exec();

    return orders;
  }

  async create(order): Promise<mongoose.Document> {
    const newOrder = new Order(order);
    const savedOrder = await newOrder.save();

    return savedOrder;
  }

  async update(id: string, updatedOrder: IOrder): Promise<mongoose.Document> {
    try {
      const existingOrder = await Order.findById(id).exec();

      if(!existingOrder) {
        return null;
      }
      
      existingOrder.set(updatedOrder);

      const savedOrder = await existingOrder.save();

      return savedOrder;
    } catch (error) {
      console.error("Error: ", error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existingOrder = await Order.findById(id).exec();

      if (!existingOrder) {
        console.log("Order not found");
      }

      await existingOrder.deleteOne({ _id: id }).exec();

      console.log("Order deleted successfully");
    } catch (error) {
      console.log("Error deleting order:", error);
    }
  }

}

export default new OrderRepository();