import logger from '@/modules/logger';
import { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { FastifyRequestWithLocals } from './injectRequestMetadata';

export const logRequestMiddleware = (
  req: FastifyRequestWithLocals,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  const { method, url, headers, query, body, locals } = req;

  const log = {
    method,
    url,
    headers,
    query,
    body,
    locals
  };

  logger.info(log);

  done();
};
