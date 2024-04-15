import authorization from '@/modules/authorization';
import { ForbiddenError } from '@/modules/errors';
import { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { FastifyRequestWithLocals } from './injectRequestMetadata';

export const canRequest = (feature: string) => {
  return function (
    req: FastifyRequestWithLocals,
    reply: FastifyReply,
    done: HookHandlerDoneFunction
  ) {
    const userTryingToRequest = req.locals.user;

    if (!authorization.can(userTryingToRequest, feature)) {
      throw new ForbiddenError({
        message: `Usuário não pode executar esta operação.`,
        action: `Verifique se este usuário possui a feature "${feature}".`,
        errorLocationCode: 'MODULE:AUTHORIZATION:CAN_REQUEST:FEATURE_NOT_FOUND'
      });
    }

    done();
  };
};
