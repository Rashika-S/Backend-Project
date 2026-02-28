const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, value: Number }],
  scores: { type: Map, of: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
