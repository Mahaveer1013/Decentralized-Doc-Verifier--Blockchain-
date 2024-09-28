// import dotenv from 'dotenv';
// import User from '../models/user.model.js';
// import { generateAccessToken } from '../utils/tokenUtils.js';
// import jwt from 'jsonwebtoken';
// import CryptoJS from 'crypto-js';

// dotenv.config();

// const secretKey = process.env.SECRET_KEY;


// const loginRequired = async (req, res, next) => {
//   const { accessToken, refreshToken } = req.cookies;

//   try {
//     jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
//       if (err && (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') && refreshToken) {
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (refreshErr, refreshDecoded) => {
//           if (refreshErr) {
//             return res.status(401).json({ message: 'Refresh token invalid or expired' });
//           }

//           const user = await User.findOne({ email: refreshDecoded.email });
//           if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//           }
//           console.log(user.email);

//           const newAccessToken = generateAccessToken({
//             email: user.email,
//             user_type: user.user_type
//           });
          
//           res.cookie('accessToken', newAccessToken, {
//             httpOnly: true,
//             maxAge: 3600000, // 1 hour
//             secure: true,   // Set to true in production with HTTPS
//             sameSite: 'None' // Set 'SameSite' to 'None' for cross-site cookies
//           });

//           req.user = user;
//           next();
//         });
//       } else if (err) {
//         return res.status(401).json({ message: 'Invalid access token' });
//       } else {
//         const user = await User.findOne({ email: decoded.email });
//         req.user = user;
//         next();
//       }
//     });
//   } catch (error) {
//     console.error('Error in authentication middleware:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// const checkIsAdmin = async (req, res, next) => {
//   try {
//     if (req.user.user_type === 1) {
//       next();
//     } else {
//       res.status(401).json({ message: 'Unauthorized User' });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };


// // Middleware to decrypt request data
// const decryptRequest = (req, res, next) => {
//   if (req.is('application/octet-stream')) {
//       let data = '';
//       req.setEncoding('utf8');
//       req.on('data', (chunk) => {
//           data += chunk;
//       });
//       req.on('end', () => {
//           try {
//               const decryptedBytes = CryptoJS.AES.decrypt(data, secretKey);
//               const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
//               req.body = JSON.parse(decryptedText);
//               next();
//           } catch (error) {
//               res.status(400).json({
//                   success: false,
//                   message: 'Failed to decrypt the value or it might not be encrypted.',
//               });
//           }
//       });
//   } else {
//       next();
//   }
// };


// // Middleware to encrypt response data
// const encryptResponse = (req, res, next) => {
//   const originalSend = res.send;

//   res.send = function (body) {
//     if (!req.enc) {
//       console.log('response:', body);
      
//       try {
//         if (body !== null) {
//           try {
//             body= CryptoJS.AES.encrypt(body, secretKey).toString();
//           } catch (error) {
//             console.error('Error during value encryption:', error);
//             throw new Error('Encryption failed');
//           }
//         }
//         req.enc = true;
//       } catch (error) {
//         console.error('Error during response encryption:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//       }
//     }
//     return originalSend.call(this, body);
//   };

//   next();
// };

// export { loginRequired, checkIsAdmin, decryptRequest, encryptResponse };
