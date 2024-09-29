import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/constants.js';
import UserModel from '../models/user.model.js';


export const loginRequired = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedData = jwt.verify(token, jwtSecret);
    const user = await UserModel.findOne({ email: decodedData.email })

    if (!user.email || !user.user_type || !user.public_key) {
      return res.status(404).json({ message: 'Some Requiremnets Not Found' })
    }
    req.user = {
      email: user.email,
      user_type: user.user_type,
      public_key: user.public_key
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Failed to decrypt authorization token' });
  }
};

