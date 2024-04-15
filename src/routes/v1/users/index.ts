import UserController from '@/controllers/user-controller';
import userRepository from '@/repositories/user-repository';
import UserService from '@/services/user-service';
import validator from '@/modules/validator';
import { FastifyRequest, HookHandlerDoneFunction, FastifyReply } from 'fastify';
import cacheControl from '@/modules/cache-control';
import { injectAnonymousOrUserMiddleware } from '@/middlewares/injectAnonymousOrUser';
import { FastifyRequestWithLocals } from '@/middlewares/injectRequestMetadata';
import { FastifyInstance } from 'fastify';

const userService = new UserService(userRepository);
const userController = new UserController(userService);

export default async (app: FastifyInstance) => {
  app.post(
    '/',
    (req: FastifyRequest, reply) => userController.create(req, reply)
  );
};
