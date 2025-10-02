import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userAuthRoutes from './routes/userAuthRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', userAuthRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

const MONGO_URI = process.env.MONGO_URI || '';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.MY_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
