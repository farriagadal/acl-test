const express = require('express');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/Book');
const Search = require('../models/Search');

// GET /api/books/search?q=:nombreDelLibro - Buscar libros en OpenLibrary
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 6 } = req.query;
    
    if (!q) {
      console.log('❌ Parámetro de búsqueda no proporcionado');
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    // Convertir parámetros a números
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    console.log(`🔍 GET /api/books/search?q=${q}&page=${pageNum}&limit=${limitNum} - Buscando libros en OpenLibrary`);
    
    // Guardar búsqueda en historial (solo en la primera página)
    if (pageNum === 1) {
      const search = new Search({ query: q });
      await search.save();
    }
    
    // Buscar en OpenLibrary - pedimos más resultados para poder saber si hay más páginas
    const response = await axios.get(`${process.env.OPENLIBRARY_API}/search.json`, {
      params: {
        q: q,
        limit: limitNum + 1, // Pedimos uno más para verificar si hay más páginas
        offset: offset
      }
    });
    
    const books = response.data.docs || [];
    
    if (books.length === 0) {
      console.log(`❌ No se encontraron libros para "${q}"`);
      return res.json({ books: [], message: 'No encontramos libros con el título ingresado' });
    }
    
    // Procesar resultados y verificar si están en mi biblioteca
    // Verificamos si hay más páginas
    const hasMorePages = books.length > limitNum;
    
    // Si hay más páginas, removemos el elemento extra que pedimos
    const booksToProcess = hasMorePages ? books.slice(0, limitNum) : books;
    
    const processedBooks = await Promise.all(
      booksToProcess.map(async (book) => {
        const coverId = book.cover_i;
        
        // Verificar si el libro está en mi biblioteca
        const savedBook = await Book.findOne({ openLibraryId: book.key });
        
        // Si el libro ya está en la biblioteca, usar la URL local para la portada
        let coverImage;
        if (savedBook) {
          // Obtener directamente la imagen base64 almacenada
          coverImage = savedBook.coverImage;
        } else {
          coverImage = coverId 
            ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            : null;
        }
        
        return {
          title: book.title,
          author: book.author_name ? book.author_name[0] : 'Autor desconocido',
          publicationYear: book.first_publish_year || 'Año desconocido',
          coverImage: coverImage,
          openLibraryId: book.key,
          coverId: coverId,
          isInLibrary: !!savedBook,
          savedBookId: savedBook ? savedBook._id : null
        };
      })
    );
    
    // Información de paginación
    const pagination = {
      page: pageNum,
      limit: limitNum,
      hasNextPage: hasMorePages,
      hasPrevPage: pageNum > 1,
      totalResults: response.data.numFound || 0,
      totalPages: Math.ceil((response.data.numFound || 0) / limitNum)
    };
    
    console.log(`✅ Encontrados ${processedBooks.length} libros para "${q}" (página ${pageNum}/${pagination.totalPages})`);
    res.json({ 
      books: processedBooks,
      pagination
    });
    
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
