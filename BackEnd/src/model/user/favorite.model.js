const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'propertyListing',
    required: true
  }
}, { timestamps: true });

const favoriteModel = mongoose.model('favorite', favoriteSchema);

module.exports = favoriteModel;