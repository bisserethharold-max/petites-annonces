import Message from '../models/Message.js';

export const envoyerMessage = async (req, res) => {
  try {
    const { produitId, destinataireId, contenu } = req.body;
    const expediteurId = req.user.idClient;

    if (!produitId || !destinataireId || !contenu) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const nouveauMessage = new Message({
      produitId,
      expediteurId,
      destinataireId,
      contenu
    });

    await nouveauMessage.save();

    res.status(201).json({ message: 'Message envoyé', data: nouveauMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
};

export const getDiscussion = async (req, res) => {
  try {
    const { produitId, autreUtilisateurId } = req.params;
    const monId = req.user.idClient;

    const messages = await Message.find({
      produitId: Number(produitId),
      $or: [
        { expediteurId: monId, destinataireId: Number(autreUtilisateurId) },
        { expediteurId: Number(autreUtilisateurId), destinataireId: monId }
      ]
    }).sort({ date: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
  }
};