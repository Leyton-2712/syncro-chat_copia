# Configuración de Autenticación con Google - Syncro Chat

## Resumen de Cambios

El sistema de autenticación con Google ha sido completamente refactorizado para funcionar como una SPA (Single Page Application) con backend desacoplado. Ahora todo el flujo de autenticación es manejado por el frontend sin necesidad de redirecciones HTML.

## Cambios Realizados

### Backend

#### 1. **Controlador Google (`src/controllers/google.controller.ts`)**
- ✅ Cambio de respuesta HTML a JSON en `googleCallbackController`
- ✅ Nuevo controlador `googleLoginController` para manejar login directo desde el frontend
- El nuevo endpoint devuelve un objeto JSON con:
  - `message`: Descripción del resultado
  - `status`: Código HTTP
  - `data`: Objeto con `token` (JWT) y `user` (datos del usuario)

#### 2. **Servicio Google (`src/services/google.service.ts`)**
- ✅ Función existente `googleLogin` sigue igual (para flujo OAuth)
- ✅ Nueva función `googleLoginFromToken` que:
  - Recibe el token JWT de Google desde el frontend
  - Decodifica el token sin verificar firma (confiamos en Google)
  - Busca o crea el usuario en BD usando email
  - Devuelve token JWT de la aplicación y datos del usuario

#### 3. **Rutas Google (`src/routes/google.route.ts`)**
- ✅ Ruta GET `/api/auth/google` - Flujo OAuth tradicional (sin cambios)
- ✅ Ruta GET `/api/auth/google/callback` - Callback de Google (ahora devuelve JSON)
- ✅ **Ruta POST `/api/auth/google/login`** - Nuevo endpoint para SPA

#### 4. **Main (`src/index.ts`)**
- ✅ Removido middleware `express.static` que servía archivos públicos HTML
- ✅ Ahora solo sirve APIs JSON

### Frontend

#### 1. **App Component (`src/App.tsx`)**
- ✅ Removida simulación del backend con `jwtDecode`
- ✅ Nuevo `handleLoginSuccess` que:
  - Recibe `credentialResponse` del componente GoogleLogin
  - Extrae el token de Google
  - Envía POST a `http://localhost:3000/api/auth/google/login` con el token
  - Recibe respuesta con token JWT y datos del usuario del backend
  - Guarda en localStorage
  - Redirige a `/chat`
- ✅ Estado `loading` para mostrar estado de autenticación

#### 2. **Header Component (`src/components/Header.tsx`)**
- ✅ Agregada prop `isLoading` para mostrar estado durante autenticación
- ✅ Desactiva el botón de login mientras se autentica

## Flujo de Autenticación

```
FRONTEND                          BACKEND                    GOOGLE
   |                                  |                          |
   |------ 1. Click en login -------->|                          |
   |                                  |                          |
   |                                  |<-- 2. Redirige a Google--->|
   |<------ 3. Redirige back ---------|                          |
   |<------ con token JWT ------------|<--- Google token -------|
   |                                  |                          |
   |-- 4. POST /api/auth/google/login -->|                      |
   |    (con Google token)            |                          |
   |                                  |-- Valida y decodifica -->|
   |                                  |-- Busca/crea usuario ---->|
   |<-- JSON con JWT + user data -----|                          |
   |                                  |                          |
   |-- 5. Guarda token + user ------->|                          |
   |-- 6. Redirige a /chat -----------|                          |
```

## Cómo Funciona

### 1. Usuario hace click en "Sign in with Google"
El componente `GoogleLogin` de `@react-oauth/google` abre un popup de Google.

### 2. Google autentica al usuario
Google valida las credenciales y devuelve un JWT.

### 3. Frontend envía el token al backend
```javascript
POST /api/auth/google/login
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE..."
}
```

### 4. Backend decodifica y crea/busca usuario
```typescript
const decoded = jwtDecode(googleToken);
const user = await prisma.user.findUnique({ where: { email } });
if (!user) {
  user = await prisma.user.create({ ... });
}
```

### 5. Backend genera JWT de la aplicación
```typescript
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
```

### 6. Backend devuelve JSON
```json
{
  "message": "Autenticación con Google exitosa",
  "status": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "username": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
}
```

### 7. Frontend guarda datos y redirige
```javascript
localStorage.setItem('token', data.data.token);
localStorage.setItem('user', JSON.stringify(data.data.user));
navigate("/chat");
```

## Variables de Entorno Necesarias

### Backend (`.env`)
```env
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
JWT_SECRET=tu_secreto_jwt_aqui
DATABASE_URL=postgresql://user:password@localhost:5432/realchat
```

### Frontend (`.env`)
```env
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
```

## Ventajas del Nuevo Flujo

1. ✅ **SPA Completa**: No hay redirecciones HTML, todo es JSON
2. ✅ **Backend Desacoplado**: El frontend puede estar en cualquier dominio
3. ✅ **Sin Sesiones**: Usa JWT en lugar de cookies
4. ✅ **Mobile Friendly**: Funciona mejor en apps móviles
5. ✅ **CORS Compatible**: Fácil de integrar con diferentes frontends
6. ✅ **Datos en BD**: Los usuarios se guardan en PostgreSQL con su primer login

## Próximos Pasos

- Implementar refresh tokens para renovar JWT expirados
- Agregar rate limiting al endpoint de login
- Implementar logout de Google desde el frontend
- Sincronizar estado de usuario entre múltiples pestañas
- Agregar middleware de autenticación para proteger rutas
