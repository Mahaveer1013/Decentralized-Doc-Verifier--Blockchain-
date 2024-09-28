// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import admin from 'firebase-admin';
// import mongoose from 'mongoose';
// import apiRoutes from './src/routes/routes.js'; 
// import { decryptRequest, encryptResponse } from './src/middlewares/middleware.js';
// import socketRouter from './src/routes/socketRouter.js';
// import http from 'http'
// import {Server} from 'socket.io'
// import socketLoginRequired from './src/middlewares/socketLoginRequired.js';


// const app = express();
// app.use(express.json());
// app.use(encryptResponse);
// app.use(decryptRequest);

// dotenv.config();

// app.use(cors({
//   origin: true,
//   credentials: true
// }));

// app.use(cookieParser());

// const server = http.createServer(app);
// const io = new Server(server);
// export const userSocketMap = new Map();

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

// app.use('/', apiRoutes);

// io.use(socketLoginRequired)
// socketRouter(io)

// mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     server.listen(5000, () => {
//       console.log('Server is running on port http://localhost:5000');
//     });
//   })
//   .catch(error => {
//     console.error('Database connection error:', error);
//   });
