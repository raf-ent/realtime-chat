import express from 'express';
import authRouter from './routes/authRouter';
import msgRouter from './routes/msgRouter';

const app = express();

// url: /api/auth


app.use("/api/auth", authRouter);
app.use("/api/messages", msgRouter);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});