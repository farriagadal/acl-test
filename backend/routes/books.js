const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const axios = require('axios');

// GET /api/books/my-library - Listar libros de mi biblioteca con filtros
router.get('/my-library', async (req, res) => {
  try {
    console.log('📚 GET /api/books/my-library - Listando libros de mi biblioteca');
    
    const { search, rating, excludeNoReview, sortBy } = req.query;
    
    let query = {};
    
    // Filtro de búsqueda por título o autor
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filtro por calificación
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    // Excluir libros sin review
    if (excludeNoReview === 'true') {
      query.review = { $exists: true, $ne: '' };
    }
    
    let sortOptions = {};
    
    // Ordenamiento
    if (sortBy === 'rating-asc') {
      sortOptions.rating = 1;
    } else if (sortBy === 'rating-desc') {
      sortOptions.rating = -1;
    } else {
      sortOptions.createdAt = -1; // Por defecto, más recientes primero
    }
    
    const books = await Book.find(query).sort(sortOptions);
    
    console.log(`✅ Encontrados ${books.length} libros en mi biblioteca`);
    res.json(books);
    
  } catch (error) {
    console.error('❌ Error listando libros de mi biblioteca:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/books/my-library/:id - Obtener libro específico
router.get('/my-library/:id', async (req, res) => {
  try {
    console.log(`📚 GET /api/books/my-library/${req.params.id} - Obteniendo libro específico`);
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      console.log(`❌ Libro con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    
    console.log(`✅ Libro "${book.title}" obtenido exitosamente`);
    res.json(book);
    
  } catch (error) {
    console.error('❌ Error obteniendo libro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/books/my-library - Guardar libro en mi biblioteca
router.post('/my-library', async (req, res) => {
  try {
    console.log('📚 POST /api/books/my-library - Guardando libro en mi biblioteca');
    console.log('📋 Datos recibidos:', req.body);
    
    const { title, author, publicationYear, coverImage, review, rating, openLibraryId, coverId } = req.body;
    
    // Validar campos requeridos
    if (!title || !author || !openLibraryId) {
      console.log('❌ Campos requeridos faltantes:', { title, author, openLibraryId });
      return res.status(400).json({ error: 'Título, autor y ID del libro son requeridos' });
    }
    
    if (!publicationYear || isNaN(publicationYear)) {
      console.log('❌ Año de publicación inválido:', publicationYear);
      return res.status(400).json({ error: 'Año de publicación debe ser un número válido' });
    }
    
    if (!coverImage) {
      console.log('❌ Imagen de portada faltante');
      return res.status(400).json({ error: 'Imagen de portada es requerida' });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      console.log('❌ Calificación inválida:', rating);
      return res.status(400).json({ error: 'Calificación debe ser entre 1 y 5' });
    }
    
    // Verificar si el libro ya existe
    const existingBook = await Book.findOne({ openLibraryId });
    if (existingBook) {
      console.log(`❌ Libro "${title}" ya existe en mi biblioteca`);
      return res.status(400).json({ error: 'Este libro ya está en tu biblioteca' });
    }
    
    const book = new Book({
      title,
      author,
      publicationYear: parseInt(publicationYear),
      coverImage,
      review,
      rating: parseInt(rating),
      openLibraryId,
      coverId
    });
    
    console.log('📖 Libro a guardar:', book);
    
    await book.save();
    
    console.log(`✅ Libro "${title}" guardado exitosamente en mi biblioteca`);
    res.status(201).json(book);
    
  } catch (error) {
    console.error('❌ Error guardando libro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/books/my-library/:id - Actualizar libro
router.put('/my-library/:id', async (req, res) => {
  try {
    console.log(`📚 PUT /api/books/my-library/${req.params.id} - Actualizando libro`);
    
    const { review, rating } = req.body;
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { review, rating },
      { new: true, runValidators: true }
    );
    
    if (!book) {
      console.log(`❌ Libro con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    
    console.log(`✅ Libro "${book.title}" actualizado exitosamente`);
    res.json(book);
    
  } catch (error) {
    console.error('❌ Error actualizando libro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/books/my-library/:id - Eliminar libro
router.delete('/my-library/:id', async (req, res) => {
  try {
    console.log(`📚 DELETE /api/books/my-library/${req.params.id} - Eliminando libro`);
    
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      console.log(`❌ Libro con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    
    console.log(`✅ Libro "${book.title}" eliminado exitosamente`);
    res.json({ message: 'Libro eliminado exitosamente' });
    
  } catch (error) {
    console.error('❌ Error eliminando libro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/books/library/front-cover/:id - Obtener portada de libro guardado
router.get('/library/front-cover/:id', async (req, res) => {
  try {
    console.log(`🖼️ GET /api/books/library/front-cover/${req.params.id} - Obteniendo portada`);
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      console.log(`❌ Libro con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    
    if (!book.coverImage) {
      console.log(`❌ Libro "${book.title}" no tiene portada`);
      return res.status(404).json({ error: 'Portada no encontrada' });
    }
    
    console.log(`✅ Portada de "${book.title}" obtenida exitosamente`);
    
    // La imagen ya se guarda como un data URL completo, así que la devolvemos directamente
    // Si por alguna razón no es un data URL, verificamos y lo convertimos
    if (book.coverImage.startsWith('data:image')) {
      res.json({ image: book.coverImage });
    } else {
      // Asumimos que es base64 y necesitamos añadir el prefijo
      res.json({ image: `data:image/jpeg;base64,${book.coverImage}` });
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo portada:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
