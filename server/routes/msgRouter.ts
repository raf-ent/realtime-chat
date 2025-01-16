import { Router } from 'express';

const msgRouter = Router();

// url: localhost:3000/api/messages/..

msgRouter.get('/', (req, res) => {
    res.send('Messages route');
});



export default msgRouter;