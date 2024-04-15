import fastify from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import { fastifyCookie } from '@fastify/cookie';
import { join } from 'node:path';
import {
  FastifyRequestWithLocals,
  injectRequestMetadataMiddleware
} from './middlewares/injectRequestMetadata';
import { logRequestMiddleware } from './middlewares/logRequest';
import { onErrorHandlerMiddleware } from './middlewares/onErrorHandler';
import { onNoMatchHandlerMiddleware } from './middlewares/OnNoMatchHandler';

const buildApp = () => {
  const app = fastify({
    logger: true
  });

  app.addHook('preHandler', (req: FastifyRequestWithLocals, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', '*');
    reply.header('Access-Control-Allow-Headers', '*');

    const isPreflight = /options/i.test(req.method);
    if (isPreflight) {
      return reply.send();
    }

    done();
  });

  app.setNotFoundHandler(onNoMatchHandlerMiddleware);
  app.setErrorHandler(onErrorHandlerMiddleware);
  app.addHook('preHandler', injectRequestMetadataMiddleware);
  app.addHook('preHandler', logRequestMiddleware);

  app.get('/health', (req, reply) => {
    return reply.send('The API service works fine!');
  });

  app.register(fastifyAutoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: 'api' }
  });

  app.register(fastifyCookie, {
    secret: 'my-secret',
    hook: 'onRequest',
    parseOptions: {}
  });

  return app;
};

export default buildApp;
