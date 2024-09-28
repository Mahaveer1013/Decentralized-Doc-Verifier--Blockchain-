// import { credentialLogin, credentialSignup, firebaselogin, getUser, logout } from '../controllers/auth.js';
// import { checkIsAdmin, loginRequired } from '../middlewares/middleware.js';
// import express from 'express';
// import { checkUserRoute, createCommunity } from '../controllers/user.js';
// import { checkAdminRoute } from '../controllers/admin.js';

// const router = express.Router();

// // ===========> get current user initally in react <==========
// router.get('/user', loginRequired, getUser);

// // ===========> Login routes <===============
// router.post('/firebase-login', firebaselogin);
// router.post('/credential-login', credentialLogin);
// router.post('/credential-signup', credentialSignup);
// router.get('/logout', logout);

// // ===========> admin routes <==============
// router.get('/check-admin', loginRequired, checkIsAdmin, checkAdminRoute);

// // ===========> user routes <=============
// router.get('/check-user', loginRequired, checkUserRoute);
// router.post('/create-community', loginRequired, createCommunity);


// export default router;
