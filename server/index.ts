import express from 'express';
import authRouter from './routes/authRouter';
import msgRouter from './routes/msgRouter';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/messages", msgRouter);

// console.log(process.env.DATABASE_URL);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});