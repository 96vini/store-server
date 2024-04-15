import { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';
import ProductController from '@/controllers/product-controller';
import ProductService from '@/services/product-service';
import ProductRepository from '@/repositories/product-repository';
import { authMiddleware } from '@/middlewares/auth';

const productService = new ProductService(ProductRepository);
const productController = new ProductController(productService);

export default async (app: FastifyInstance) => {
  app.get('/',
    (req: FastifyRequest, reply: FastifyReply) =>
    productController.findAll(req, reply)
  );

  app.post('/create',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply: FastifyReply) =>
    productController.create(req, reply)
  );

  app.get('/:id',
    (req: FastifyRequest, reply: FastifyReply) =>
    productController.findById(req, reply)
  );

  app.get('/delete/:id',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply: FastifyReply) =>

    productController.delete(req, reply)
  );

  app.post('/update/:id',
    { preHandler: authMiddleware },
    (req: FastifyRequest, reply: FastifyReply) =>
    
    productController.update(req, reply)
  );

};
