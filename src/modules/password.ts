import bcryptjs from 'bcrypt';
import crypto from 'crypto';

const hash = async (password: string) => {
  return await bcryptjs.hash(password, getNumberOfSaltRounds());
};

const compare = async (providedPassword: string, storedPassword: string) => {
  return await bcryptjs.compare(providedPassword, storedPassword);
};

const getNumberOfSaltRounds = () => {
  const saltRounds = 14;
  return saltRounds;
};

const generateRandomPassword = (length: number) => {
  const buffer = crypto.randomBytes(length);
  return buffer.toString('base64');
};

export default Object.freeze({
  hash,
  compare,
  generateRandomPassword
});
