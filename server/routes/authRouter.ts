import { Router } from 'express';

const authRouter = Router();

// url: /api/auth/..


authRouter.get('/login', (req, res) => {
  res.send('Login route');
});

authRouter.get('/logout', (req, res) => {
    res.send('Logout route');
});

authRouter.get('/register', (req, res) => {
  res.send('Register route');
});





export default authRouter;