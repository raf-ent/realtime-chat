import { Router } from 'express';
import verifyProfile from '../middleware/protectRoute';
import {sendMessage, getMessages, getConversations} from '../controllers/msgController';

const msgRouter = Router();

// url: localhost:3000/api/messages/..

msgRouter.post('/user/:id', verifyProfile, sendMessage);

msgRouter.get('/user/:id', verifyProfile, getMessages);

msgRouter.get('/conversations', verifyProfile, getConversations);


export default msgRouter;