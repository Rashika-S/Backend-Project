const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  // weights: map of minorName -> number
  weights: { type: Map, of: Number, default: {} },
  options: [{ value: Number, label: String }] // optional
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
