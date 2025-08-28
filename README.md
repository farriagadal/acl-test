# 📚 ACL Test - Biblioteca de Libros

Una aplicación SPA completa para buscar, gestionar y revisar libros utilizando la API de OpenLibrary.

## 🏗️ Estructura del Proyecto

```
acl-test/
├── frontend/          # Aplicación Nuxt 3
├── backend/           # API Node.js/Express
└── docker-compose.yml # Configuración de MongoDB
```

## 🚀 Características

### Frontend (Nuxt 3)
- ✅ Buscador de libros con placeholder personalizado
- ✅ Historial de las últimas 5 búsquedas
- ✅ Resultados de búsqueda (máximo 10)
- ✅ Vista detallada de libros
- ✅ Sistema de calificación con estrellas (1-5)
- ✅ Campo de review (máximo 500 caracteres)
- ✅ Sección "Mi Biblioteca" con filtros avanzados
- ✅ Gestión completa de libros (editar, eliminar)
- ✅ Diseño responsive y moderno
- ✅ Store Pinia para gestión de estado

### Backend (Node.js/Express)
- ✅ Integración con OpenLibrary API
- ✅ Base de datos MongoDB
- ✅ Endpoints RESTful completos
- ✅ Logging detallado de operaciones
- ✅ Manejo de errores robusto
- ✅ Conversión de imágenes a base64

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Nuxt 3, Vue 3, Pinia, Sass
- **Backend**: Node.js 18, Express, MongoDB, Mongoose
- **Base de Datos**: MongoDB
- **APIs**: OpenLibrary API

## 📋 Endpoints de la API

### Búsqueda y Libros
- `GET /api/books/search?q=:nombreDelLibro` - Buscar libros
- `GET /api/books/last-search` - Últimas búsquedas

### Mi Biblioteca
- `GET /api/books/my-library` - Listar libros con filtros
- `GET /api/books/my-library/:id` - Obtener libro específico
- `POST /api/books/my-library` - Guardar libro
- `PUT /api/books/my-library/:id` - Actualizar libro
- `DELETE /api/books/my-library/:id` - Eliminar libro
- `GET /api/books/library/front-cover/:id` - Obtener portada

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- Docker y Docker Compose
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd acl-test
```

### 2. Iniciar MongoDB
```bash
docker-compose up -d
```

### 3. Configurar y ejecutar el Backend
```bash
cd backend
npm install
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### 4. Configurar y ejecutar el Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 🔧 Configuración

### Variables de Entorno (Backend)
Crear archivo `backend/config.env`:
```env
PORT=3001
MONGODB_URI=mongodb://admin:password123@localhost:27017/acl-test?authSource=admin
OPENLIBRARY_API=https://openlibrary.org
```

### Variables de Entorno (Frontend)
Crear archivo `frontend/.env`:
```env
API_BASE=http://localhost:3001
```

## 📱 Funcionalidades Principales

### 1. Búsqueda de Libros
- Buscador centrado con placeholder personalizado
- Integración con OpenLibrary API
- Historial de búsquedas recientes
- Resultados limitados a 10 libros

### 2. Gestión de Libros
- Vista detallada con información completa
- Sistema de calificación visual (estrellas)
- Campo de review con límite de caracteres
- Conversión automática de portadas a base64

### 3. Mi Biblioteca
- Almacenamiento persistente en MongoDB
- Filtros avanzados (título, autor, calificación)
- Ordenamiento por calificación o fecha
- Exclusión de libros sin review
- Edición y eliminación con confirmación

## 🎨 Diseño y UX

- **Diseño Moderno**: Interfaz limpia y atractiva
- **Responsive**: Adaptable a todos los dispositivos
- **Animaciones**: Transiciones suaves y feedback visual
- **Accesibilidad**: Navegación intuitiva y clara
- **Feedback**: Mensajes de éxito y confirmaciones

## 🔍 Logs y Monitoreo

El backend incluye logging detallado para todas las operaciones:
- ✅ Búsquedas exitosas
- ❌ Errores y excepciones
- 📚 Operaciones CRUD en la biblioteca
- 🔍 Consultas a OpenLibrary API

## 🧪 Pruebas

### Probar la API
```bash
# Buscar libros
curl "http://localhost:3001/api/books/search?q=harry+potter"

# Obtener búsquedas recientes
curl "http://localhost:3001/api/books/last-search"

# Listar mi biblioteca
curl "http://localhost:3001/api/books/my-library"
```

## 📝 Notas de Desarrollo

- **Nombres en Español**: Todas las entidades y campos mantienen nombres en español
- **Manejo de Errores**: Implementación robusta de manejo de errores
- **Validaciones**: Validaciones tanto en frontend como backend
- **Seguridad**: Sanitización de inputs y validación de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado para ACL Test - Aplicación de Biblioteca de Libros

---

**¡Disfruta explorando y gestionando tu biblioteca personal! 📚✨**
