import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  produitId: { type: Number, required: true },
  expediteurId: { type: Number, required: true },
  destinataireId: { type: Number, required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;