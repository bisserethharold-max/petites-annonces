import pool from '../config/db.js';

export const createAnnonce = async (req, res) => {
  try {
    const { titre, description, etat, prix, id_sous_categorie } = req.body;
    const Client_particulier_idClient = req.user.idClient; 

    if (!titre || !description || !etat || !prix || !id_sous_categorie) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    const [result] = await pool.execute(
      `INSERT INTO Produit (titre, description, etat, prix, statut, Client_particulier_idClient, id_sous_categorie)
       VALUES (?, ?, ?, ?, 'disponible', ?, ?)`,
      [titre, description, etat, prix, Client_particulier_idClient, id_sous_categorie]
    );

    res.status(201).json({
      message: 'Annonce créée avec succès',
      annonceId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'annonce' });
  }
};

export const getAllAnnonces = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, sc.nom AS sous_categorie_nom, c.nom AS categorie_nom
      FROM Produit p
      JOIN sous_categorie sc ON p.id_sous_categorie = sc.idsous_categorie
      JOIN Categorie c ON sc.idcategorie = c.idcategorie
      ORDER BY p.idProduit DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des annonces' });
  }
};

export const getAnnonceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT p.*, sc.nom AS sous_categorie_nom, c.nom AS categorie_nom, cl.nom AS vendeur_nom, cl.email AS vendeur_email
      FROM Produit p
      JOIN sous_categorie sc ON p.id_sous_categorie = sc.idsous_categorie
      JOIN Categorie c ON sc.idcategorie = c.idcategorie
      JOIN Client_particulier cl ON p.Client_particulier_idClient = cl.idClient
      WHERE p.idProduit = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Annonce introuvable' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'annonce' });
  }
};

export const deleteAnnonce = async (req, res) => {
  try {
    const { id } = req.params;
    const Client_particulier_idClient = req.user.idClient;
    const userRole = req.user.role;

    const [rows] = await pool.execute('SELECT * FROM Produit WHERE idProduit = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Annonce introuvable' });
    }

    const annonce = rows[0];

    if (annonce.Client_particulier_idClient !== Client_particulier_idClient && userRole !== 'admin') {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await pool.execute('DELETE FROM Produit WHERE idProduit = ?', [id]);

    res.status(200).json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce' });
  }
};

export const getHistoriqueUtilisateur = async (req, res) => {
  try {
    const idClient = req.user.idClient;

    const [annoncesPubliees] = await pool.execute(
      'SELECT * FROM Produit WHERE Client_particulier_idClient = ?',
      [idClient]
    );

    const [achats] = await pool.execute(
      `SELECT A.*, P.nom, P.description, P.photos 
       FROM Achat A 
       JOIN Produit P ON A.Produit_idProduit = P.idProduit 
       WHERE A.idClient = ?`,
      [idClient]
    );

    const [locations] = await pool.execute(
      `SELECT L.*, P.nom, P.description, P.photos 
       FROM Location L 
       JOIN Produit P ON L.Produit_idProduit = P.idProduit 
       WHERE L.idClient = ?`,
      [idClient]
    );

    res.status(200).json({
      publiees: annoncesPubliees,
      achats,
      locations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};