const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rankedMinors: [{
    minor: { type: String },
    score: { type: Number },
    label: { type: String } // Eligible / Potential / Not Recommended
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
