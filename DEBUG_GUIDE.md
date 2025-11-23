# 🐛 Guía de Debugging - Google Auth

## Problemas Comunes y Soluciones

### 1. "Error en la autenticación con Google"

**Síntoma:** El login falla con error en consola

**Causas posibles:**
- Google Client ID incorrecto o expirado
- CORS bloqueando la solicitud
- Backend no está corriendo en el puerto 3000

**Solución:**
```javascript
// En DevTools → Console
localStorage.getItem('token')  // ¿Hay token?
// Si no, verifica:
// 1. ¿El Client ID en .env es correcto?
// 2. ¿El backend está corriendo?
// 3. ¿Puedes hacer ping a http://localhost:3000?
```

---

### 2. "Backend respondió: 400 Token de Google no proporcionado"

**Síntoma:** Frontend envía la solicitud pero backend dice que falta el token

**Causa:** El token de Google no se envía correctamente

**Solución - Verificar en DevTools → Network:**
```
1. Click en request POST /api/auth/google/login
2. Preview tab → Ver respuesta
3. Request tab → Ver qué se envió en el body
4. Debe ser: { "token": "eyJhbGciOi..." }
```

**Debug en Frontend:**
```typescript
// En App.tsx, agregar antes de fetch:
console.log("Token enviado:", {
  token: tokenGoogle
});
```

---

### 3. "Usuario NO aparece en la BD"

**Síntoma:** Login parece funcionar pero no se crea usuario

**Verificación:**
```bash
# Conectar a PostgreSQL
psql -U kvm -d realchat

# Ver todos los usuarios
SELECT id, username, email FROM "User";

# Ver usuario específico
SELECT * FROM "User" WHERE email = 'tuEmail@gmail.com';
```

**Causas posibles:**
- BD no está corriendo
- URL de conexión incorrecta
- Permiso de escritura en BD

**Solución:**
```bash
# Verificar que PostgreSQL está activo
psql -U kvm -d realchat -c "SELECT 1;"  # Si sale "1" está OK

# Ver logs del backend
# El backend debe mostrar: "Usuario creado con Google"
```

---

### 4. "CORS Error: No 'Access-Control-Allow-Origin' header"

**Síntoma:** Erro en consola sobre CORS

**Causa:** Frontend (puerto 5173) no puede comunicarse con Backend (3000)

**Verificar en backend/src/index.ts:**
```typescript
const io = new Server(httpServer, {
    cors: {
        origin: "*",  // ✅ Debe estar "*" o "http://localhost:5173"
        methods: ["GET", "POST"]
    }
});
```

**Solución:** Reinicia el backend después de verificar

---

### 5. "GET /api/auth/google funciona pero POST no"

**Síntoma:** La ruta GET de Google funciona, pero POST /api/auth/google/login falla

**Verificación con curl:**
```bash
curl -X POST http://localhost:3000/api/auth/google/login \
  -H "Content-Type: application/json" \
  -d '{"token":"test"}'

# Respuesta esperada:
# { "message": "ocurrio un error durante la autenticacion con Google", "status": 500 }
```

**Causa:** Probablemente rutas no registradas correctamente

**Verificar en backend/src/routes/route.ts:**
```typescript
router.use("/api/auth", googleRoutes);  // ✅ Debe estar
```

---

## Logs Útiles

### Backend - Qué buscar en la consola:

**Login exitoso:**
```
Usuario creado con Google: juan@gmail.com
JWT generado correctamente
```

**Error:**
```
Error en googleLoginFromToken: [error message]
error en googleLoginController: [stack trace]
```

### Frontend - DevTools Console:

**Exitoso:**
```javascript
"1. Google nos autenticó. Enviando token al backend..."
"2. Backend respondió:" {data: {...}}
"3. Autenticación exitosa, redirigiendo a chat..."
```

**Error:**
```javascript
"Error en login con Google: [message]"
"TypeError: Cannot read property 'data' of undefined"
```

---

## Verificación Paso a Paso

### Paso 1: ¿Backend está corriendo?
```bash
curl http://localhost:3000/api/health
# Esperar respuesta JSON
```

### Paso 2: ¿Frontend está corriendo?
```bash
# Desde otra terminal
curl http://localhost:5173
# Esperar HTML
```

### Paso 3: ¿CORS OK?
```javascript
// En DevTools → Console del navegador
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Paso 4: ¿Google Client ID es válido?
```bash
# Backend
echo $GOOGLE_CLIENT_ID  # Debe mostrar algo como "123456789.apps.googleusercontent.com"

# Frontend
# En DevTools → Console
import.meta.env.VITE_GOOGLE_CLIENT_ID
```

### Paso 5: ¿Tokens se están guardando en localStorage?
```javascript
// DevTools → Console
localStorage.getItem('token')      // Debe tener JWT
localStorage.getItem('user')       // Debe tener JSON del usuario
```

---

## Test de la API Completa

### Con Postman o Insomnia

```
POST http://localhost:3000/api/auth/google/login
Content-Type: application/json

{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE..."
}
```

**Respuesta esperada (200 OK):**
```json
{
  "message": "Autenticación con Google exitosa",
  "status": 200,
  "data": {
    "user": {
      "id": "clxxx...",
      "username": "Juan Pérez",
      "email": "juan@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Checklist de Configuración

- [ ] ¿Archivo `backend/.env` existe?
- [ ] ¿`GOOGLE_CLIENT_ID` en `backend/.env` está set?
- [ ] ¿`GOOGLE_CLIENT_SECRET` en `backend/.env` está set?
- [ ] ¿Archivo `frontend/.env` existe?
- [ ] ¿`VITE_GOOGLE_CLIENT_ID` en `frontend/.env` está set (igual que backend)?
- [ ] ¿`DATABASE_URL` en `backend/.env` es correcta?
- [ ] ¿PostgreSQL está corriendo?
- [ ] ¿`npm install` ejecutado en backend y frontend?
- [ ] ¿Backend sin errores de compilación?
- [ ] ¿Frontend sin errores de compilación?

---

## Comandos Útiles para Debugging

```bash
# Ver logs del backend en tiempo real
npm run dev

# Conectar a BD PostgreSQL
psql -U kvm -d realchat

# Ver todos los usuarios
SELECT * FROM "User";

# Ver último usuario creado
SELECT * FROM "User" ORDER BY "createdAt" DESC LIMIT 1;

# Contar usuarios
SELECT COUNT(*) FROM "User";

# Eliminar usuario de prueba
DELETE FROM "User" WHERE email = 'test@gmail.com';

# Verificar puerto del backend
lsof -i :3000

# Verificar puerto del frontend
lsof -i :5173

# Limpiar caché frontend (Vite)
rm -rf frontend/syncro-chat-front/node_modules/.vite
```

---

## Console Errors Explicados

### "jwt-decode is not exported"
**Solución:** Asegúrate que instalaste la dependencia:
```bash
cd backend && npm install jwt-decode
```

### "Cannot find module @react-oauth/google"
**Solución:**
```bash
cd frontend/syncro-chat-front
npm install @react-oauth/google
```

### "prisma not defined"
**Solución:** Importa correctamente en el archivo:
```typescript
import prisma from "../db/prisma";  // ✅
import { prisma } from "../db/prisma";  // ❌
```

---

## Performance

### Si el login es muy lento:

1. Verifica la velocidad de la BD:
```bash
psql -U kvm -d realchat -c "SELECT COUNT(*) FROM \"User\";"
```

2. Verifica latencia de red:
```javascript
// DevTools → Network tab
// Busca tiempo de respuesta en POST /api/auth/google/login
// Debe ser < 500ms
```

3. Habilita queryLogging en Prisma:
```typescript
// En src/db/prisma.ts
const prisma = new PrismaClient({
  log: ['query', 'info'],  // Ver queries
});
```

---

## Contacto

Si todo esto no funciona, verifica:
1. ¿Cuál es exactamente el error que ves?
2. ¿En dónde aparece? (Navegador, backend console, BD)
3. ¿Qué pasos seguiste antes?
4. Comparte los logs completos del backend

