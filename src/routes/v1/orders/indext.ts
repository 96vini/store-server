import { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';
import OrderController from 'controllers/order-controller'
import OrderService from '@/services/order-service';
import OrderRepository from '@/repositories/order-repository';
import { authMiddleware } from '@/middlewares/auth';

const orderService = new OrderService(OrderRepository);
const orderController = new OrderController(orderService);

export default async (app: FastifyInstance) => {
  app.get('/',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply: FastifyReply) =>
    orderController.findAll(req, reply)
  );

  app.post('/create',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply) =>
    orderController.create(req, reply)
  );

  app.post('/update/:id',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply) =>
    orderController.updateStatus(req, reply)
  );

  app.post('/delete',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply) =>
    orderController.delete(req, reply)
  );

  app.get('/:id',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply) =>
    orderController.findByID(req, reply)
  );

};
