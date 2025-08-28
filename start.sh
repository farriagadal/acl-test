#!/bin/bash

echo "Iniciando ACL Test - Biblioteca de Libros"
echo

echo "1. Iniciando MongoDB..."
docker-compose up -d
echo "MongoDB iniciado correctamente"
echo

echo "2. Instalando dependencias del backend..."
cd backend
npm install
echo "Dependencias del backend instaladas"
echo

echo "3. Instalando dependencias del frontend..."
cd ../frontend
npm install
echo "Dependencias del frontend instaladas"
echo

echo "4. Iniciando backend..."
cd ../backend
gnome-terminal --title="Backend ACL Test" -- bash -c "npm run dev; exec bash" &
echo "Backend iniciado en http://localhost:3001"
echo

echo "5. Iniciando frontend..."
cd ../frontend
gnome-terminal --title="Frontend ACL Test" -- bash -c "npm run dev; exec bash" &
echo "Frontend iniciado en http://localhost:3000"
echo

echo "¡Aplicación iniciada correctamente!"
echo
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo "MongoDB: localhost:27017"
echo

# Para macOS, usar open -a Terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detectado macOS, usando Terminal.app"
    cd ../backend
    open -a Terminal "npm run dev"
    cd ../frontend
    open -a Terminal "npm run dev"
fi
