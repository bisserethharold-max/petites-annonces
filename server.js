import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectMongo from './src/config/mongo.js';
import authRoutes from './src/routes/authRoutes.js';
import annonceRoutes from './src/routes/annonceRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';

dotenv.config();

connectMongo();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});