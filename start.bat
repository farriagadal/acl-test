@echo off
echo Iniciando ACL Test - Biblioteca de Libros
echo.

echo 1. Iniciando MongoDB...
docker-compose up -d
echo MongoDB iniciado correctamente
echo.

echo 2. Instalando dependencias del backend...
cd backend
call npm install
echo Dependencias del backend instaladas
echo.

echo 3. Instalando dependencias del frontend...
cd ../frontend
call npm install
echo Dependencias del frontend instaladas
echo.

echo 4. Iniciando backend...
cd ../backend
start "Backend ACL Test" cmd /k "npm run dev"
echo Backend iniciado en http://localhost:3001
echo.

echo 5. Iniciando frontend...
cd ../frontend
start "Frontend ACL Test" cmd /k "npm run dev"
echo Frontend iniciado en http://localhost:3000
echo.

echo ¡Aplicación iniciada correctamente!
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo MongoDB: localhost:27017
echo.
pause
