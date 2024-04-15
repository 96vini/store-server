import snakeize from 'snakeize';
import { NotFoundError } from '@/modules/errors';
import {
  FastifyRequestWithLocals,
  injectRequestMetadataMiddleware
} from './injectRequestMetadata';
import { v4 as uuidV4 } from 'uuid';
import logger from '@/modules/logger';

export const onNoMatchHandlerMiddleware = async (
  req: FastifyRequestWithLocals,
  reply
) => {
  injectRequestMetadataMiddleware(req);
  const publicErrorObject = new NotFoundError({
    requestId: req.locals?.requestId || uuidV4()
  });

  const privateErrorObject = {
    ...publicErrorObject,
    locals: { ...req.locals }
  };
  logger.info(snakeize(privateErrorObject));

  return reply
    .status(publicErrorObject.statusCode)
    .send(snakeize(publicErrorObject));
};
