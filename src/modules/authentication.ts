import { UnauthorizedError } from '@/modules/errors';
import password from './password';
import session from './session';
import mongoose from 'mongoose';

const hashPassword = async (unhashedPassword) => {
  return await password.hash(unhashedPassword);
};

const comparePasswords = async (providedPassword, passwordHash) => {
  const passwordMatches = await password.compare(
    providedPassword,
    passwordHash
  );

  if (!passwordMatches) {
    throw new UnauthorizedError({
      message: 'A senha informada não confere com a senha do usuário.',
      action: 'Verifique se a senha informada está correta e tente novamente.',
      errorLocationCode:
        'MODULE:AUTHENTICATION:COMPARE_PASSWORDS:PASSWORD_MISMATCH'
    });
  }
};

const createSession = async (userId: string | mongoose.Types.ObjectId) => {
  const sessionObject = await session.create(userId);
  return sessionObject;
};

export default Object.freeze({
  hashPassword,
  comparePasswords,
  createSession
});
