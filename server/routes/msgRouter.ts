import { Router } from 'express';
import verifyProfile from '../middleware/verifyProfile';
import sendMessage from '../controllers/msgController';

const msgRouter = Router();

// url: localhost:3000/api/messages/..

msgRouter.post('/user/:id', verifyProfile, sendMessage);

//msgRouter.get('/user/:id', verifyProfile, getMessages);


export default msgRouter;