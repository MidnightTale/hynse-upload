import jwt from 'jsonwebtoken';
import config from '../../config';

export const generateToken = (username) => {
  return jwt.sign({ username }, config.secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.secretKey);
  } catch (error) {
    return null;
  }
};