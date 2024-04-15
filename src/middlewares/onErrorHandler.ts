import snakeize from 'snakeize';
import { FastifyRequestWithLocals } from './injectRequestMetadata';
import { FastifyReply } from 'fastify';
import {
  ForbiddenError,
  IBaseError,
  InternalServerError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
  UnprocessableEntityError,
  ValidationError
} from '@/modules/errors';
import logger from '@/modules/logger';
import session from '@/modules/session';

export const onErrorHandlerMiddleware = (
  error: IBaseError,
  req: FastifyRequestWithLocals,
  reply: FastifyReply
) => {
  console.log(error);
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError ||
    error instanceof UnprocessableEntityError ||
    error instanceof TooManyRequestsError
  ) {
    const publicErrorObject = {
      ...error,
      requestId: req.locals.requestId
    };

    const privateErrorObject = {
      ...publicErrorObject,
      locals: { ...req.locals }
    };
    logger.info(snakeize(privateErrorObject));

    return reply.status(error.statusCode).send(snakeize(publicErrorObject));
  }

  if (error instanceof UnauthorizedError) {
    const publicErrorObject = {
      ...error,
      requestId: req.locals.requestId
    };

    const privateErrorObject = {
      ...publicErrorObject,
      locals: { ...req.locals }
    };
    logger.info(snakeize(privateErrorObject));

    session.clearSessionIdCookie(reply);

    return reply.status(error.statusCode).send(snakeize(publicErrorObject));
  }

  const publicErrorObject = new InternalServerError({
    requestId: req.locals?.requestId,
    errorId: error.errorId,
    statusCode: error.statusCode,
    errorLocationCode: error.errorLocationCode
  });

  const privateErrorObject = {
    ...new InternalServerError({
      ...error,
      requestId: req.locals?.requestId
    }),
    locals: { ...req.locals }
  };

  logger.error(snakeize(privateErrorObject));

  return reply
    .status(publicErrorObject.statusCode)
    .send(snakeize(publicErrorObject));
};
