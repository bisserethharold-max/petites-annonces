import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { nom, code_postal, email, password } = req.body;

  try {
    const [existing] = await pool.execute('SELECT idClient FROM Client_particulier WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = 'client';

    const [result] = await pool.execute(
      'INSERT INTO Client_particulier (nom, code_postal, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [nom, code_postal, email, hashedPassword, defaultRole]
    );

    res.status(201).json({ message: 'Utilisateur créé', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la création du compte' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.execute('SELECT * FROM Client_particulier WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { idClient: user.idClient, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        idClient: user.idClient,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};