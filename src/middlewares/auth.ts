import auth from '@/utils/auth';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface TokenPayload {
  id: string;
  role: Omit<string, 'created_at' | 'updated_at'>;
  exp: number;
  sub: string;
}

export interface AuthMiddlewareRequest extends FastifyRequest {
  user: {
    id: string;
    role: Omit<string, 'created_at' | 'updated_at'>;
  };
}

export type UserRequestPayload = {
  id: string;
  role: Omit<string, 'created_at' | 'updated_at'>;
};

export const authMiddleware = async (
  req: AuthMiddlewareRequest,
  reply: FastifyReply
) => {
  const authHeader = req.headers.authorization as string;

  if (!authHeader) {
    return reply.status(401).send({
      message: 'UNAUTHORIZED_TOKEN'
    });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return reply.status(401).send({
      message: 'UNAUTHORIZED_TOKEN'
    });
  }

  try {
    const payload = auth.verifyAccessToken(token) as TokenPayload;

    req.user = payload;

    return;
  } catch (err) {
    return reply.status(401).send({ message: 'UNAUTHORIZED_TOKEN' });
  }
};
