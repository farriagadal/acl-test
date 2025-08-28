const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para ordenar por timestamp
searchSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Search', searchSchema);
