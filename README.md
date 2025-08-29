# 📚 ACL Test - Biblioteca de Libros

Una aplicación SPA completa para buscar, gestionar y revisar libros utilizando la API de OpenLibrary.

## 🏗️ Estructura del Proyecto

```
acl-test/
├── frontend/          # Aplicación Nuxt 3
├── backend/           # API Node.js/Express
└── docker-compose.yml # Configuración de MongoDB
```

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
