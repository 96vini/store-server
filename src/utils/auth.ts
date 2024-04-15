import * as jwt from 'jsonwebtoken';
import config from '@/config';
import mongoose from 'mongoose';

const JWT_SECRET = config.jwt_secret;

const generateAccessToken = (userId: string | mongoose.Types.ObjectId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1zd' });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export default Object.freeze({
  generateAccessToken,
  verifyAccessToken
});
