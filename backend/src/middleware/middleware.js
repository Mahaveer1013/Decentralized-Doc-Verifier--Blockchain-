import jwt from 'jsonwebtoken';
import { jwtSecret } from '../constants.js';


export const loginRequired = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedData = jwt.verify(token, jwtSecret);
    req.user = decodedData;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Failed to decrypt authorization token' });
  }
};

