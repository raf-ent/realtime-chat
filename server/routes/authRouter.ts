import { Router } from 'express';
import { login, logout, register, getProfile } from '../controllers/authController';
import verifyProfile from '../middleware/verifyProfile';

const authRouter = Router();

// url: localhost:3000/api/auth/..


authRouter.post('/login', login);

authRouter.post('/logout', logout);

authRouter.post('/register', register);

authRouter.get('/profile', verifyProfile, getProfile);



export default authRouter;