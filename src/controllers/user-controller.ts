import jwt from 'jsonwebtoken';
import { FastifyRequestWithLocals } from '@/middlewares/injectRequestMetadata';
import session from '@/modules/session';
import UserService from '@/services/user-service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Order } from '@/models/order';

interface ICreateUserRequest {
  email: string;
  username: string;
  name: string;
  password: string;
  avatar_url?: string;
}

export default class UserController {
  readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    return;
  }

  async renewSessionIfNecessary(
    req: FastifyRequestWithLocals,
    reply: FastifyReply
  ) {
    return;
  }

  async createOrder(req: FastifyRequest, reply: FastifyReply) {
    return;
  }
}
