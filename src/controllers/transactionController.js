import pool from '../config/db.js';

export const acheterProduit = async (req, res) => {
  try {
    const { produitId, prix, lieuEchange } = req.body;
    const clientId = req.user.idClient;

    if (!produitId || !prix || !lieuEchange) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const [produits] = await pool.execute('SELECT * FROM Produit WHERE idProduit = ?', [produitId]);
    if (produits.length === 0) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    if (produits[0].statut !== 'disponible') {
      return res.status(400).json({ message: 'Ce produit n\'est plus disponible' });
    }

    const commission = prix * 0.05;
    const montantVendeur = prix - commission;
    const date = new Date().toISOString().slice(0, 10);

    await pool.execute(
      `INSERT INTO Achat (date, statut, prix, commission, montant_vendeur, Produit_idProduit, idClient, lieu_echange)
       VALUES (?, 'paye', ?, ?, ?, ?, ?, ?)`,
      [date, prix, commission, montantVendeur, produitId, clientId, lieuEchange]
    );

    await pool.execute('UPDATE Produit SET statut = "vendu" WHERE idProduit = ?', [produitId]);

    res.status(201).json({ message: 'Achat effectué avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du traitement de l\'achat' });
  }
};

export const louerProduit = async (req, res) => {
  try {
    const { produitId, creneau, lieuEchange, tarifJour, cautionPayee } = req.body;
    const clientId = req.user.idClient;

    if (!produitId || !creneau || !lieuEchange || !tarifJour) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (!cautionPayee) {
      return res.status(402).json({ message: 'Réservation bloquée : la caution doit être réglée' });
    }

    const [produits] = await pool.execute('SELECT * FROM Produit WHERE idProduit = ?', [produitId]);
    if (produits.length === 0) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    if (produits[0].statut !== 'disponible') {
      return res.status(400).json({ message: 'Ce produit n\'est plus disponible à la location' });
    }

    const commission = tarifJour * 0.10;
    const montantVendeur = tarifJour - commission;
    const date = new Date().toISOString().slice(0, 10);

    await pool.execute(
      `INSERT INTO Location (date, creneau, lieu_echange, statut, tarif_jour, Produit_idProduit, idClient, commission, montant_vendeur)
       VALUES (?, ?, ?, 'reserve', ?, ?, ?, ?, ?)`,
      [date, creneau, lieuEchange, tarifJour, produitId, clientId, commission, montantVendeur]
    );

    await pool.execute('UPDATE Produit SET statut = "loue" WHERE idProduit = ?', [produitId]);

    res.status(201).json({ message: 'Location réservée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réservation de la location' });
  }
};