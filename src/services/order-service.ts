import { IOrderRepository } from "@/repositories/order-repository";
import HttpResponse from '@/utils/HttpResponse';
import { ObjectId } from 'mongoose';

class OrderService {
  readonly orderRepository: IOrderRepository;

  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async findAll() {
    const orders = this.orderRepository.findAll();
    return HttpResponse.ok(orders);
  }

  async findById(id: ObjectId) {
    const order = this.orderRepository.findOneById(id);
    return HttpResponse.ok(order);
  }

  async findByUserId(user_id: ObjectId) {
    const order = this.orderRepository.findByUserId(user_id);
    return order;
  }

  async findByLocation(location) {
    const orders = this.orderRepository.findByLocation(location);
    return HttpResponse.ok(orders);
  }

  async create(order) {
    const newOrder = this.orderRepository.create(order);
    return HttpResponse.created(newOrder);
  }

  async updateStatus(id, updatedOrder) {
    const editOrder = this.orderRepository.update(id, updatedOrder);
    return HttpResponse.ok(editOrder);
  }

  async delete(id) {
    const deleteOrder = this.orderRepository.delete(id);
    return HttpResponse.ok(deleteOrder);
  }

}

export default OrderService;