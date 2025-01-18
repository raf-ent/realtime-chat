import { Router } from 'express';
import { login, logout, register } from '../controllers/authController';

const authRouter = Router();

// url: localhost:3000/api/auth/..


authRouter.post('/login', login);

authRouter.post('/logout', logout);

authRouter.post('/register', register);




export default authRouter;