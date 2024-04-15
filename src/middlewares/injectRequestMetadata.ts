import ip from '@/modules/ip';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

import mongoose from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export type SessionObject = {
  id: string | mongoose.Types.ObjectId;
  user_id: string | mongoose.Types.ObjectId[];
  token: string;
  expires_at: Date;
};

export interface FastifyRequestWithLocals extends FastifyRequest {
  locals: {
    user: {
      id?: string | mongoose.Types.ObjectId;
      name?: string;
      username?: string;
      email?: string;
    };
    session: SessionObject;
    requestId: string;
    clientIp: string;
  };
}

export const injectRequestMetadataMiddleware = (
  req: FastifyRequestWithLocals,
  reply?: FastifyReply,
  done?: HookHandlerDoneFunction
) => {
  req.locals = {
    ...req.locals,
    requestId: uuidV4(),
    clientIp: ip.extractFromRequest(req)
  };

  if (done) {
    done();
  }
};
