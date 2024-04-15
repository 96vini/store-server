import authorization from '@/modules/authorization';
import { ForbiddenError } from '@/modules/errors';
import session from '@/modules/session';
import validator from '@/modules/validator';

import { FastifyRequestWithLocals } from './injectRequestMetadata';
import userRepository from '@/repositories/user-repository';
import user from '@/modules/user';

export const injectAnonymousOrUserMiddleware = async (
  req: FastifyRequestWithLocals
) => {
  const injectAuthenticatedUser = async (req: FastifyRequestWithLocals) => {
    const sessionObject = await session.findOneValidFromRequest(req);
    const userObject = await userRepository.findOneById(sessionObject.user_id);

    if (!authorization.can(userObject, 'read:session')) {
      throw new ForbiddenError({
        message: `Você não possui permissão para executar esta ação.`,
        action: `Verifique se este usuário já ativou a sua conta e recebeu a feature "read:session".`,
        errorLocationCode:
          'MODULE:AUTHENTICATION:INJECT_AUTHENTICATED_USER:USER_CANT_READ_SESSION'
      });
    }

    req.locals = {
      ...req.locals,
      user: userObject,
    };
  };

  const injectAnonymousUser = (req) => {
    const anonymousUser = user.createAnonymous();
    req.locals = {
      ...req.locals,
      user: anonymousUser
    };
  };

  if (req.cookies?.session_id) {
    const cleanCookies = validator(req.cookies, {
      session_id: 'required'
    });
    req.cookies.session_id = cleanCookies.session_id;

    return await injectAuthenticatedUser(req);
  } else {
    return injectAnonymousUser(req);
  }
};
