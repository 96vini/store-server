import { SessionObject } from '@/middlewares/injectRequestMetadata';
import { Session } from '@/models/session';
import session from '@/modules/session';
import mongoose from 'mongoose';

export type PostSession = {
  userId: string;
  token: string;
  expiresAt: Date;
};

interface ISessionRepository {
  create(session: PostSession): Promise<mongoose.Document>;
  delete(token: string): Promise<void>;
  findOneValidByToken(sessionToken: string): Promise<SessionObject>;
  renewObject(sessionId: string): Promise<SessionObject>;
}

class SessionRepository implements ISessionRepository {
  async create({ userId: user_id, expiresAt: expires_at, token }: PostSession) {
    const newSession = new Session({
      token,
      expires_at,
      user_id
    });

    const savedSession = await newSession.save();

    return savedSession;
  }

  async delete(token: string) {
    await Session.deleteOne({ token }).exec();
  }

  async findOneValidByToken(sessionToken: string) {
    const storedSession = await Session.findOne(
      {
        token: sessionToken,
        expires_at: { $gt: new Date() }
      },
      {
        projection: { _id: 1, user_id: 1, token: 1, expires_at: 1 }
      }
    ).lean();

    const session = {
      id: storedSession._id,
      user_id: storedSession.user_id,
      token: storedSession.token,
      expires_at: storedSession.expires_at
    };

    return session;
  }

  async renewObject(sessionId: string | mongoose.Types.ObjectId) {
    const expiresAt = new Date(
      Date.now() + 1000 * session.SESSION_EXPIRATION_IN_SECONDS
    );

    const updatedSession = await Session.findOneAndUpdate(
      { _id: sessionId },
      {
        $set: {
          expires_at: expiresAt,
          updated_at: new Date()
        }
      },
      {
        new: true,
        projection: { _id: 1, user_id: 1, token: 1, expires_at: 1 }
      }
    ).lean();

    return {
      id: updatedSession._id,
      user_id: updatedSession.user_id,
      token: updatedSession.token,
      expires_at: updatedSession.expires_at
    };
  }
}

export default new SessionRepository();
