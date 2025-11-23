# 🚀 Guía Rápida - Login con Google Integrado

## ✅ Lo que se ha configurado

Tu backend ahora:
- ✅ NO devuelve HTML (solo JSON)
- ✅ Guarda usuarios de Google en la BD PostgreSQL
- ✅ Genera JWT válidos para tu aplicación
- ✅ Tiene endpoint POST `/api/auth/google/login` para SPA

Tu frontend ahora:
- ✅ Envía el token de Google al backend
- ✅ Recibe token JWT + datos del usuario
- ✅ Almacena en localStorage
- ✅ Redirige a `/chat` automáticamente

## 🔧 Pasos previos (IMPORTANTE)

### 1. Configurar las variables de entorno

**Backend** (`backend/.env`):
```env
GOOGLE_CLIENT_ID=tu_id_de_google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_secret_de_google
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
JWT_SECRET=holaMundo2025
DATABASE_URL=postgresql://kvm:1010@localhost:5432/realchat
PORT=3000
```

**Frontend** (`frontend/syncro-chat-front/.env`):
```env
VITE_GOOGLE_CLIENT_ID=tu_id_de_google.apps.googleusercontent.com
```

### 2. Obtener credenciales de Google

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo
3. Ve a "OAuth 2.0 Client IDs"
4. Configura las URI autorizadas:
   - `http://localhost:3000/api/auth/google/callback` (para OAuth tradicional)
   - `http://localhost:3000` (para el frontend)
   - `http://localhost:5173` (si tu frontend corre en Vite)
5. Copia `Client ID` y `Client Secret`

## 🏃 Cómo ejecutar

### Terminal 1: Backend
```bash
cd backend
npm run dev
# El servidor estará en http://localhost:3000
```

### Terminal 2: Frontend
```bash
cd frontend/syncro-chat-front
npm run dev
# El frontend estará en http://localhost:5173
```

## 🧪 Prueba el flujo

1. Abre http://localhost:5173 en tu navegador
2. Haz click en "Sign in with Google"
3. Autentica con tu cuenta de Google
4. **Verifica en tu BD PostgreSQL** que el usuario se creó:
   ```sql
   SELECT * FROM "User" WHERE email = 'tuEmail@gmail.com';
   ```
5. Deberías ser redirigido a `/chat`
6. En la consola del navegador, verifica:
   ```javascript
   localStorage.getItem('token')  // Debe tener un JWT válido
   JSON.parse(localStorage.getItem('user'))  // Debe tener tu info
   ```

## 🔍 Debugging

### Si no funciona, verifica:

**En el backend:**
- ¿Las variables de entorno están correctas? `echo $GOOGLE_CLIENT_ID`
- ¿El servidor está corriendo? `lsof -i :3000`
- ¿Puedes hacer POST a la ruta? `curl -X POST http://localhost:3000/api/auth/google/login`

**En el frontend:**
- ¿El Google Client ID está en `.env`? `cat .env`
- ¿Webpack cargó el env? Abre DevTools → Console
- ¿Ve el botón "Sign in with Google"?

**En la BD:**
- ¿PostgreSQL está corriendo? `psql -U kvm -d realchat`
- ¿La tabla de usuarios existe? `\d "User"`

## 📝 Flujo detallado

```
1. Usuario hace click en "Sign in with Google"
   ↓
2. Google abre popup y autentica
   ↓
3. Frontend recibe token JWT de Google
   ↓
4. Frontend envía: POST /api/auth/google/login { token }
   ↓
5. Backend decodifica el token
   ↓
6. Backend busca/crea usuario en BD
   ↓
7. Backend genera JWT de la app
   ↓
8. Backend responde JSON con token + user data
   ↓
9. Frontend guarda en localStorage
   ↓
10. Frontend redirige a /chat
```

## 🛠️ Endpoints disponibles

### Google Auth
- `GET /api/auth/google` - Iniciar flujo OAuth
- `GET /api/auth/google/callback` - Callback de Google
- `GET /api/auth/google/failure` - Error en Google Auth
- `POST /api/auth/google/login` - ⭐ Login desde frontend (SPA)

### Estructura de POST `/api/auth/google/login`
**Request:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE..."
}
```

**Response (200 OK):**
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

**Response (500 Error):**
```json
{
  "message": "ocurrio un error durante la autenticacion con Google",
  "status": 500
}
```

## ✨ Próximos pasos opcionales

- [ ] Agregar icono personalizado
- [ ] Guardar foto de perfil del usuario
- [ ] Implementar logout desde Google
- [ ] Agregar refresh tokens
- [ ] Rate limiting en el endpoint de login
- [ ] Validar origin del token
- [ ] Guardar refresh token de Google

---

**¿Preguntas?** Revisa el archivo `GOOGLE_AUTH_SETUP.md` para más detalles técnicos.
