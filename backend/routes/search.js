const express = require('express');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/Book');
const Search = require('../models/Search');

// GET /api/books/search?q=:nombreDelLibro - Buscar libros en OpenLibrary
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      console.log('❌ Parámetro de búsqueda no proporcionado');
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    console.log(`🔍 GET /api/books/search?q=${q} - Buscando libros en OpenLibrary`);
    
    // Guardar búsqueda en historial
    const search = new Search({ query: q });
    await search.save();
    
    // Buscar en OpenLibrary
    const response = await axios.get(`${process.env.OPENLIBRARY_API}/search.json`, {
      params: {
        q: q,
        limit: 10
      }
    });
    
    const books = response.data.docs || [];
    
    if (books.length === 0) {
      console.log(`❌ No se encontraron libros para "${q}"`);
      return res.json({ books: [], message: 'No encontramos libros con el título ingresado' });
    }
    
    // Procesar resultados y verificar si están en mi biblioteca
    const processedBooks = await Promise.all(
      books.map(async (book) => {
        const coverId = book.cover_i;
        const coverUrl = coverId 
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : null;
        
        // Verificar si el libro está en mi biblioteca
        const savedBook = await Book.findOne({ openLibraryId: book.key });
        
        return {
          title: book.title,
          author: book.author_name ? book.author_name[0] : 'Autor desconocido',
          publicationYear: book.first_publish_year || 'Año desconocido',
          coverImage: coverUrl,
          openLibraryId: book.key,
          coverId: coverId,
          isInLibrary: !!savedBook,
          savedBookId: savedBook ? savedBook._id : null
        };
      })
    );
    
    console.log(`✅ Encontrados ${processedBooks.length} libros para "${q}"`);
    res.json({ books: processedBooks });
    
  } catch (error) {
    console.error('❌ Error buscando libros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/books/last-search - Obtener últimas 5 búsquedas
router.get('/last-search', async (req, res) => {
  try {
    console.log('🔍 GET /api/books/last-search - Obteniendo últimas búsquedas');
    
    const searches = await Search.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .select('query timestamp');
    
    console.log(`✅ Obtenidas ${searches.length} búsquedas recientes`);
    res.json(searches);
    
  } catch (error) {
    console.error('❌ Error obteniendo búsquedas recientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
