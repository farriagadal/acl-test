const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publicationYear: {
    type: Number,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  review: {
    type: String,
    maxlength: 500,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  openLibraryId: {
    type: String,
    required: true,
    unique: true
  },
  coverId: {
    type: String
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ rating: 1 });
bookSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Book', bookSchema);
