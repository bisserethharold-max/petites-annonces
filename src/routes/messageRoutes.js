import express from 'express';
import { envoyerMessage, getDiscussion } from '../controllers/messageController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, envoyerMessage);
router.get('/:produitId/:autreUtilisateurId', authMiddleware, getDiscussion);

export default router;