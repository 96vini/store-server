import { FastifyRequest, FastifyReply } from 'fastify';

import OrderService from '@/services/order-service';

import { 
  IOrder,
  ICreateOrderRequest,
  IUpdateStatusOrderRequest,
  IFindOrderByIdRequest,
  IFindByUserIDRequest,
  IDeleteOrderRequest } from '@/interfaces/order';

export default class OrderController {
  readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async findAll(req: FastifyRequest, reply: FastifyReply) {
    const orders = await this.orderService.findAll();

    if(!orders) {
      return reply.status(500).send("Nenhum registro de pedido foi encontrado!");
    }

    return reply.status(200).send(orders);
  }

  async findByID(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.query as IFindOrderByIdRequest;

    const order = await this.orderService.findById(id);
    
    if(!order) {
      return reply.status(500).send(`Nenhuma pedido foi encontrada com o id ${id}`);
    }

    return reply.status(200).send(order);
  }

  async findByUserID(req: FastifyRequest, reply: FastifyReply) {
    const { user_id } = req.body as IFindByUserIDRequest;

    const order = await this.orderService.findByUserId(user_id);

    return reply.status(200).send(order);
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const { user, products, totalAmount } = req.body as ICreateOrderRequest;

    if(!user || !products || !totalAmount) {
      return reply.status(500).send("Erro ao gerar pedido, verifique os campos");
    }
    
    const newOrder = this.orderService.create({
      user,
      products,
      totalAmount
    });

    return reply.status(200).send(newOrder);
  }

  async updateStatus(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.query as IUpdateStatusOrderRequest;
    const { status } = req.body as IOrder;

    const updatedOrder = await this.orderService.updateStatus(id, status);

    if (!updatedOrder) {
      return reply.status(500).send("Ocorreu um erro ao atualizar pedido");
    }

    return reply.status(200).send(updatedOrder);
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.query as IDeleteOrderRequest;

    const deletedOrder = await this.orderService.delete(id);

    if(!deletedOrder) {
      return reply.status(500).send("Erro ao deletar pedido");
    }

    return reply.status(200).send(deletedOrder);
  }

}