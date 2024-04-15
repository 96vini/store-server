import cookie from 'cookie';
import { Session } from '@/models/session';
import auth from '@/utils/auth';
import sessionRepository from '@/repositories/session-repository';
import { FastifyReply } from 'fastify';
import cacheControl from './cache-control';
import { FastifyRequestWithLocals } from '@/middlewares/injectRequestMetadata';
import { UnauthorizedError } from './errors';
import validator from './validator';
import mongoose from 'mongoose';

const SESSION_EXPIRATION_IN_SECONDS = 60 * 60 * 24 * 30;

const create = async (userId: string | mongoose.Types.ObjectId) => {
  const sessionToken = auth.generateAccessToken(userId);
  const expiresAt = new Date(Date.now() + 1000 * SESSION_EXPIRATION_IN_SECONDS);

  const newSession = new Session({
    token: sessionToken,
    user_id: userId,
    expires_at: expiresAt
  });

  return newSession;
};

function setSessionIdCookieInReply(sessionToken: string, reply: FastifyReply) {
  cacheControl.noCache(undefined, reply);
  const secureCookie = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: secureCookie,
    path: '/',
    maxAge: SESSION_EXPIRATION_IN_SECONDS
  };
  const serializedCookie = cookie.serialize(
    'session_id',
    sessionToken,
    cookieOptions
  );

  reply.header('set-cookie', serializedCookie);
}

const findOneValidFromRequest = async (req: FastifyRequestWithLocals) => {
  validator(req.cookies, {
    session_id: 'required'
  });

  const sessionToken = req.cookies?.session_id;

  if (!sessionToken) {
    throw new UnauthorizedError({
      message: `Usuário não possui sessão ativa.`,
      action: `Verifique se este usuário está logado.`
    });
  }

  const sessionObject =
    await sessionRepository.findOneValidByToken(sessionToken);

  if (!sessionObject) {
    throw new UnauthorizedError({
      message: `Usuário não possui sessão ativa.`,
      action: `Verifique se este usuário está logado.`
    });
  }

  return sessionObject;
};

async function renew(
  sessionId: string | mongoose.Types.ObjectId,
  reply: FastifyReply
) {
  const sessionObjectRenewed = await sessionRepository.renewObject(sessionId);
  setSessionIdCookieInReply(sessionObjectRenewed.token, reply);
  return sessionObjectRenewed;
}

const clearSessionIdCookie = (reply: FastifyReply) => {
  cacheControl.noCache(undefined, reply);
  const secureCookie = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: secureCookie,
    path: '/',
    maxAge: -1
  };
  const serializedCookie = cookie.serialize(
    'session_id',
    'invalid',
    cookieOptions
  );

  reply.header('set-cookie', serializedCookie);
};

export default Object.freeze({
  create,
  SESSION_EXPIRATION_IN_SECONDS,
  findOneValidFromRequest,
  renew,
  clearSessionIdCookie
});
