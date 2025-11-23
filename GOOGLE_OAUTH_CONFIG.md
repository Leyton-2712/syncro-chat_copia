# 🔧 Configuración de Google OAuth - Guía Completa

## ⚠️ Error CORS - "The given origin is not allowed for the given client ID"

Este error significa que los orígenes autorizados en Google Console NO incluyen `http://localhost:5173`

---

## 📋 Paso 1: Obtener Credenciales de Google

### 1.1 Crear Proyecto en Google Cloud Console

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo o selecciona uno existente
3. Habilita "Google+ API"

### 1.2 Crear OAuth 2.0 Client ID

1. Ve a **"APIs & Services"** → **"Credentials"**
2. Click en **"Create Credentials"** → **"OAuth client ID"**
3. Selecciona **"Web application"** como tipo
4. Dale un nombre: "Syncro Chat Local Dev"

### 1.3 Agregar Orígenes Autorizados

En la sección **"Authorized JavaScript origins"**, agrega:

```
http://localhost:3000
http://localhost:5173
http://localhost:5174
```

En la sección **"Authorized redirect URIs"**, agrega:

```
http://localhost:3000/api/auth/google/callback
http://localhost:3000
```

**Presiona SAVE**

---

## 📝 Paso 2: Configurar Variables de Entorno

### Backend (`.env`)

```env
# Google OAuth
GOOGLE_CLIENT_ID=907384023626-dc85nheco1hirprrbouf9cejvs3utekr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Otros
JWT_SECRET=holaMundo2025
DATABASE_URL=postgresql://kvm:1010@localhost:5432/realchat
PORT=3000
```

### Frontend (`.env`)

```env
VITE_GOOGLE_CLIENT_ID=907384023626-dc85nheco1hirprrbouf9cejvs3utekr.apps.googleusercontent.com
```

**⚠️ IMPORTANTE:** Ambos deben tener el MISMO `CLIENT_ID`

---

## 🔍 Paso 3: Verificar Configuración

### 3.1 Backend - CORS Habilitado

El backend ahora tiene CORS configurado para:
- `http://localhost:5173` (Frontend Vite)
- `http://localhost:3000` (Backend)
- `http://localhost:5174` (Fallback alternativo)

**Archivo:** `backend/src/index.ts`

```typescript
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
```

### 3.2 Frontend - Cliente ID Cargado

Verifica en DevTools:
```javascript
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
// Debe mostrar: 907384023626-dc85nheco1hirprrbouf9cejvs3utekr.apps.googleusercontent.com
```

---

## 🚀 Paso 4: Prueba Completa

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Debe mostrar: "Servidor corriendo en el puerto: 3000"
```

### Terminal 2: Frontend
```bash
cd frontend/syncro-chat-front
npm run dev
# Debe mostrar: "VITE v5.x.x  ready in xxx ms"
```

### Navegador

**Antes de hacer login, verifica:**

1. Abre DevTools (F12)
2. Ve a **Console**
3. Ejecuta:
```javascript
// Verifica Client ID
console.log("CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID)

// Verifica CORS
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(d => console.log("CORS OK:", d))
  .catch(e => console.error("CORS ERROR:", e))
```

Si ves "CORS OK", continúa con el login.

---

## ✅ Flujo de Login Correcto

```
1. Click "Sign in with Google"
   ✓ Debe abrir popup de Google
   
2. Autentica con tu cuenta
   ✓ El popup se cierra
   ✓ En Console verás: "1. Google nos autenticó..."
   
3. Frontend envía token al backend
   ✓ En Console verás: "2. Backend respondió:"
   ✓ Verás el JWT y datos del usuario
   
4. Se redirige a /chat
   ✓ Autenticación completada
```

---

## 🐛 Si Sigue Sin Funcionar

### Error: "The given origin is not allowed"

**Solución:**
1. En Google Console, verifica que TODOS estos orígenes estén:
   - `http://localhost:3000`
   - `http://localhost:5173`
2. Presiona **SAVE**
3. Espera 5-10 minutos (cambios tardan en propagarse)
4. Limpia caché del navegador: Ctrl+Shift+Delete

### Error: "Access to fetch blocked by CORS"

**Solución:**
1. Backend reiniciado? `npm run dev`
2. ¿Están los headers CORS en el código?
3. Verifica que `cors` esté importado:
   ```typescript
   import cors from "cors";
   ```

### Error: "Failed to fetch"

**Causas:**
- Backend no está corriendo en puerto 3000
- Firewall bloqueando puerto 3000
- Red local con problemas

**Verificar:**
```bash
# ¿Está corriendo backend?
curl http://localhost:3000/api/health

# ¿Qué proceso usa puerto 3000?
lsof -i :3000
```

---

## 📦 Checklist Final

Antes de hacer login, verifica:

- [ ] Google Console tiene OAuth Client creado
- [ ] Client ID en `backend/.env`
- [ ] Client ID en `frontend/.env`
- [ ] Orígenes autorizados: `localhost:3000` y `localhost:5173`
- [ ] Redirect URI: `http://localhost:3000/api/auth/google/callback`
- [ ] Backend corriendo: `npm run dev` en `backend/`
- [ ] Frontend corriendo: `npm run dev` en `frontend/syncro-chat-front/`
- [ ] Sin errores en DevTools Console
- [ ] Variables de entorno se cargaron correctamente

---

## 🔐 Para Producción

Cuando despliegues a producción, actualiza:

### Google Console
```
Authorized JavaScript origins:
- https://tudominio.com
- https://www.tudominio.com

Authorized redirect URIs:
- https://tudominio.com/api/auth/google/callback
- https://www.tudominio.com/api/auth/google/callback
```

### Backend (`.env` en producción)
```env
GOOGLE_CALLBACK_URL=https://api.tudominio.com/api/auth/google/callback
PORT=3000
# Otros valores...
```

### Frontend (`.env` en producción)
```env
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
VITE_API_URL=https://api.tudominio.com
```

### Actualiza también `backend/src/index.ts`
```typescript
app.use(cors({
    origin: ["https://tudominio.com", "https://www.tudominio.com"],
    credentials: true
}));
```

---

## 📞 Debugging

Si todo sigue sin funcionar, ejecuta en DevTools Console:

```javascript
// 1. Verifica Client ID
console.log("CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID)

// 2. Verifica CORS
const testCORS = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/health')
    console.log("Response:", res)
    const data = await res.json()
    console.log("CORS OK - Data:", data)
  } catch (e) {
    console.error("CORS FAILED:", e)
  }
}
testCORS()

// 3. Verifica si Google está cargado
console.log("Google loaded:", !!window.google)

// 4. Verifica localStorage
console.log("Token:", localStorage.getItem('token'))
console.log("User:", localStorage.getItem('user'))
```

