import express from 'express';
import { createAnnonce, getAllAnnonces, getAnnonceById, deleteAnnonce, getHistoriqueUtilisateur } from '../controllers/annonceController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllAnnonces);
router.get('/mes-annonces/historique', authMiddleware, getHistoriqueUtilisateur);
router.get('/:id', getAnnonceById);
router.post('/', authMiddleware, upload.single('image'), createAnnonce);
router.delete('/:id', authMiddleware, deleteAnnonce);

export default router;