import express from 'express';
import { acheterProduit, louerProduit } from '../controllers/transactionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/achat', authMiddleware, acheterProduit);
router.post('/location', authMiddleware, louerProduit);

export default router;