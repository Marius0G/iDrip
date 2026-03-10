import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'iDrip Backend is running' });
});

// Placeholder for Wardrobe API
app.get('/api/wardrobe', (req, res) => {
    res.status(200).json({ items: [] });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
