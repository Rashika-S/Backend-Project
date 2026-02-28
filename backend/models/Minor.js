const mongoose = require('mongoose');

const minorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  maxPossibleWeight: { type: Number, default: 10 } // optional helper
}, { timestamps: true });

module.exports = mongoose.model('Minor', minorSchema);
