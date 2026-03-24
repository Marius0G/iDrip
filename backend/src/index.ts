import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seed } from './seed/seed';
import wardrobeRoutes from './routes/wardrobe';
import outfitRoutes from './routes/outfits';
import recommendationRoutes from './routes/recommendations';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'iDrip Backend is running' });
});

app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);

async function start() {
  await connectDB();
  await seed();
  app.listen(PORT, () => {
    console.log(`iDrip Backend running on port ${PORT}`);
  });
}

start();
