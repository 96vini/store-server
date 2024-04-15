import { FastifyRequest, FastifyInstance } from 'fastify';
import SessionController from 'controllers/session-controller';
import userRepository from '@/repositories/user-repository';
import UserService from '@/services/user-service';

const userService = new UserService(userRepository);
const sessionController = new SessionController(userService);

export default async (app: FastifyInstance) => {
  app.post('/register', (req: FastifyRequest, reply) =>
    sessionController.register(req, reply)
  );
  app.post('/login', (req: FastifyRequest, reply) => 
    sessionController.login(req, reply)
  );
};
