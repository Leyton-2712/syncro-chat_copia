#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║           VERIFICADOR DE CONFIGURACIÓN - Syncro Chat              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar Backend corriendo
echo "🔍 Verificando Backend..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend corriendo en puerto 3000${NC}"
else
    echo -e "${RED}❌ Backend NO está corriendo${NC}"
    echo "   Ejecuta: cd backend && npm run dev"
fi

# 2. Verificar Frontend corriendo
echo ""
echo "🔍 Verificando Frontend..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend corriendo en puerto 5173${NC}"
else
    echo -e "${RED}❌ Frontend NO está corriendo${NC}"
    echo "   Ejecuta: cd frontend/syncro-chat-front && npm run dev"
fi

# 3. Verificar variables de entorno Backend
echo ""
echo "🔍 Verificando variables de entorno Backend..."
cd backend
if grep -q "GOOGLE_CLIENT_ID=" .env; then
    CLIENT_ID=$(grep "GOOGLE_CLIENT_ID=" .env | cut -d '=' -f 2)
    if [ -z "$CLIENT_ID" ] || [ "$CLIENT_ID" = "tu_google_client_id_aqui" ]; then
        echo -e "${YELLOW}⚠️  GOOGLE_CLIENT_ID no configurado${NC}"
    else
        echo -e "${GREEN}✅ GOOGLE_CLIENT_ID configurado${NC}"
    fi
else
    echo -e "${RED}❌ .env no encontrado${NC}"
fi
cd ..

# 4. Verificar variables de entorno Frontend
echo ""
echo "🔍 Verificando variables de entorno Frontend..."
cd frontend/syncro-chat-front
if grep -q "VITE_GOOGLE_CLIENT_ID=" .env; then
    VITE_ID=$(grep "VITE_GOOGLE_CLIENT_ID=" .env | cut -d '=' -f 2)
    if [ -z "$VITE_ID" ] || [ "$VITE_ID" = "tu-id-laaaargo-que-termina-en.apps.googleusercontent.com" ]; then
        echo -e "${YELLOW}⚠️  VITE_GOOGLE_CLIENT_ID no configurado${NC}"
    else
        echo -e "${GREEN}✅ VITE_GOOGLE_CLIENT_ID configurado${NC}"
    fi
else
    echo -e "${RED}❌ .env no encontrado en frontend${NC}"
fi
cd ../..

# 5. Verificar dependencias
echo ""
echo "🔍 Verificando dependencias..."
if cd backend && npm list cors > /dev/null 2>&1; then
    echo -e "${GREEN}✅ cors instalado en backend${NC}"
else
    echo -e "${RED}❌ cors NO instalado${NC}"
    echo "   Ejecuta: cd backend && npm install cors"
fi
cd ..

if cd frontend/syncro-chat-front && npm list @react-oauth/google > /dev/null 2>&1; then
    echo -e "${GREEN}✅ @react-oauth/google instalado en frontend${NC}"
else
    echo -e "${RED}❌ @react-oauth/google NO instalado${NC}"
    echo "   Ejecuta: cd frontend/syncro-chat-front && npm install @react-oauth/google"
fi
cd ../..

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                      PASOS SIGUIENTES                              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  Asegúrate de que Backend y Frontend estén corriendo"
echo "2️⃣  Verifica que los Client IDs estén configurados en .env"
echo "3️⃣  Ve a Google Console y autoriza estos orígenes:"
echo "    - http://localhost:3000"
echo "    - http://localhost:5173"
echo "4️⃣  Abre http://localhost:5173 en tu navegador"
echo "5️⃣  Abre DevTools (F12) y busca errores en Console"
echo ""
