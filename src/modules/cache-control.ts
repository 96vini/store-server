import { InternalServerError } from '@/modules/errors';
import { FastifyReply, HookHandlerDoneFunction } from 'fastify';

function setCacheControl(reply: FastifyReply, cacheControl: string): void {
  const cacheControlHeader = reply.getHeader('cache-control');

  if (
    String(cacheControlHeader)?.toLowerCase() === cacheControl.toLowerCase()
  ) {
    return;
  }

  reply.header('cache-control', cacheControl);

  const setHeader = reply.header.bind(reply);

  reply.header = (name: string, value: string) => {
    if (name.toLowerCase() === 'cache-control') {
      throw new InternalServerError({
        message: `Header Cache-Control já foi definido.`,
        errorLocationCode:
          'MODULE:CACHE_CONTROL:DIFFERENT_CACHE_CONTROL_ALREADY_DEFINED'
      });
    }

    return setHeader(name, value);
  };
}

function noCache(_, reply: FastifyReply, done?: HookHandlerDoneFunction) {
  setCacheControl(reply, 'no-cache, no-store, max-age=0, must-revalidate');
  if (done) done();
}

function swrMaxAge(maxAge = 10) {
  if (!Number.isInteger(maxAge))
    throw new TypeError('maxAge must be an integer.');

  return (_, reply: FastifyReply, done?: HookHandlerDoneFunction) => {
    setCacheControl(
      reply,
      `public, s-maxage=${maxAge.toString()}, stale-while-revalidate`
    );
    if (done) done();
  };
}

export default Object.freeze({
  noCache,
  swrMaxAge
});
