# 💬 RealChat

**RealChat** es una aplicacion web de mensajeria en tiempo real que permite a los usuarios comunicarse instantaneamente mediante chats individuales y grupales. La plataforma ofrece autenticacion segura con JWT y Google OAuth 2.0, comunicacion bidireccional en tiempo real usando WebSockets (Socket.IO), y una arquitectura moderna basada en TypeScript, Express y PostgreSQL.

---

## Instalacion

### **1. Clonar el Repositorio**

```bash
git clone <url-del-repositorio>
cd realChat
```

### **2. Instalar Dependencias**

```bash
npm install
```

### **3. Configurar Variables de Entorno**

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Base de Datos
DB_NAME=realchat
DB_USER=kvm
DB_PASSWORD=1010
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL="postgresql://kvm:1010@localhost:5432/realchat"

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### **4. Iniciar PostgreSQL con Docker**

```bash
# Iniciar contenedor de PostgreSQL
docker-compose up -d

# Verificar que esta corriendo
docker ps
```

Esto iniciara PostgreSQL en el puerto 5432 con las credenciales del archivo `.env`.

### **5. Configurar Prisma y Base de Datos**

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma db push

# (Opcional) Abrir Prisma Studio para ver los datos
npx prisma studio
```

### **6. Iniciar el Servidor**

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# El servidor estara en http://localhost:3000
```
---

## Tabla de Contenidos

- [Descripcion](#-descripcion)
- [Caracteristicas](#-caracteristicas)
- [Tecnologias](#-tecnologias)
- [Requisitos Previos](#-requisitos-previos)
- [Instalacion](#-instalacion)
- [Configuracion](#-configuracion)
- [Comandos](#-comandos)
- [Pruebas con Postman](#-pruebas-con-postman)
- [API Endpoints](#-api-endpoints)
- [Socket.IO Eventos](#-socketio-eventos)
---

## Configuracion

### **Configuracion de Docker**

El archivo `docker-compose.yml` configura PostgreSQL:

```yaml
services:
  db:
    image: postgres:15-alpine
    container_name: postgres
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### **Configuracion de TypeScript**

El archivo `tsconfig.json` define la configuracion de TypeScript:

- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Habilitado
- **Source Maps**: Habilitado
- **Decorators**: Habilitado (para class-validator)

### **Configuracion de Prisma**

El archivo `prisma.config.ts` configura Prisma ORM:

```typescript
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: String(process.env.DATABASE_URL),
  },
});
```

### **Configuracion de Google OAuth**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth 2.0"
5. Configura:
   - **Tipo de aplicacion**: Aplicacion web
   - **URIs de redireccionamiento autorizados**: 
     - `http://localhost:3000/api/auth/google/callback` (desarrollo)
     - `https://tu-dominio.com/api/auth/google/callback` (produccion)
6. Copia el Client ID y Client Secret al archivo `.env`

---

## Comandos

### **Desarrollo**

```bash
# Iniciar en modo desarrollo (hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar version compilada
npm start
```

### **Docker**

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Detener PostgreSQL
docker-compose down

# Ver logs de PostgreSQL
docker-compose logs -f db

# Reiniciar PostgreSQL
docker-compose restart db

# Eliminar contenedor y volumen (¡CUIDADO! Borra todos los datos)
docker-compose down -v
```

### **Prisma**

```bash
# Generar cliente de Prisma
npx prisma generate

# Aplicar cambios del schema a la BD
npx prisma db push

# Crear una migracion
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en produccion
npx prisma migrate deploy

# Abrir Prisma Studio (GUI para ver/editar datos)
npx prisma studio

# Resetear base de datos (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset
```

### **Node.js**

```bash
# Instalar dependencias
npm install

# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Corregir vulnerabilidades
npm audit fix
```

---

## Descripcion

RealChat es una plataforma completa de mensajeria que combina lo mejor de las tecnologias modernas para ofrecer una experiencia de chat fluida y segura. La aplicacion permite:

- **Comunicacion en tiempo real** mediante WebSockets con Socket.IO
- **Autenticacion múltiple** con email/password y Google OAuth 2.0
- **Chats individuales y grupales** con gestion de participantes
- **Persistencia de datos** usando PostgreSQL y Prisma ORM
- **Arquitectura escalable** con TypeScript y Express
- **Containerizacion** con Docker para desarrollo y despliegue

La plataforma esta diseñada para ser facil de configurar, desarrollar y desplegar, con soporte completo para desarrollo local usando Docker Compose y despliegue en la nube con Railway.

---

## Caracteristicas

- **Autenticacion Segura**
  - Login con email y contraseña
  - Autenticacion con Google OAuth 2.0
  - Tokens JWT para sesiones stateless
  - Hash de contraseñas con bcrypt

- **Mensajeria en Tiempo Real**
  - Comunicacion bidireccional con Socket.IO
  - Mensajes instantaneos
  - Indicador de "esta escribiendo"
  - Notificaciones en tiempo real

- **Gestion de Chats**
  - Chats individuales (1 a 1)
  - Chats grupales (múltiples participantes)
  - Agregar/remover participantes
  - Historial de mensajes persistente

- **Arquitectura Moderna**
  - TypeScript para type-safety
  - Prisma ORM para base de datos
  - Express para API REST
  - Docker para containerizacion

---

## Tecnologias

### **Backend**

| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| **Node.js** | 20.x | Runtime de JavaScript para el servidor |
| **TypeScript** | 5.9.3 | Superset de JavaScript con tipado estatico |
| **Express** | 5.1.0 | Framework web minimalista y flexible |
| **Socket.IO** | 4.8.1 | Libreria para comunicacion en tiempo real con WebSockets |

### **Base de Datos**

| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| **PostgreSQL** | 15-alpine | Base de datos relacional robusta |
| **Prisma** | 6.19.0 | ORM moderno con type-safety y migraciones |
| **Docker** | - | Containerizacion de PostgreSQL |

### **Autenticacion y Seguridad**

| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| **JWT** | 9.0.2 | Tokens para autenticacion stateless |
| **bcrypt** | 6.0.0 | Hash de contraseñas con salt |
| **Passport** | 0.7.0 | Middleware de autenticacion |
| **passport-google-oauth20** | 2.0.0 | Estrategia de Google OAuth 2.0 |

### **Utilidades**

| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| **dotenv** | 17.2.3 | Variables de entorno |
| **body-parser** | 2.2.0 | Parser de body HTTP |
| **class-validator** | 0.14.2 | Validacion de DTOs |
| **nodemailer** | 7.0.10 | Envio de emails |

### **Desarrollo**

| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| **nodemon** | 3.1.10 | Hot-reload en desarrollo |
| **ts-node** | 10.9.2 | Ejecutar TypeScript directamente |
| **copyfiles** | 2.4.1 | Copiar archivos estaticos |


---

##  Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x ([Descargar](https://nodejs.org/))
- **Docker** y **Docker Compose** ([Descargar](https://www.docker.com/))
- **Git** ([Descargar](https://git-scm.com/))
- **Postman** (opcional, para pruebas) ([Descargar](https://www.postman.com/))

---

## Pruebas con Postman

### **Importar Coleccion**

1. Abre Postman
2. Click en "Import"
3. Selecciona el archivo `Real Chat.postman_collection.json`
4. La coleccion se importara con todos los endpoints

### **Configurar Variables**

1. En Postman, ve a la coleccion "Real Chat"
2. Click en "Variables"
3. Configura la variable `url`:
   ```
   url = http://localhost:3000/api
   ```

### **Endpoints Disponibles**

La coleccion incluye:

#### **Auth**
- `POST /api/auth/login` - Iniciar sesion
- `POST /api/auth/registro` - Registrarse

#### **Chats**
- `POST /api/chats` - Crear chat
- `GET /api/chats` - Listar mis chats
- `GET /api/chats/:chatId` - Ver chat especifico
- `PUT /api/chats/:chatId` - Actualizar chat
- `DELETE /api/chats/:chatId` - Eliminar chat
- `POST /api/chats/:chatId/participants` - Agregar participante

#### **Mensajes**
- `POST /api/messages` - Enviar mensaje
- `GET /api/chats/:chatId/messages` - Ver mensajes del chat
- `GET /api/messages/:messageId` - Ver mensaje especifico
- `PUT /api/messages/:messageId` - Editar mensaje
- `DELETE /api/messages/:messageId` - Eliminar mensaje

#### **Health Check**
- `GET /api/healthCheck` - Verificar estado del servidor

### **Flujo de Prueba**

1. **Registrar usuario**:
   ```
   POST /api/auth/registro
   Body: {
     "username": "testuser",
     "email": "test@test.com",
     "password": "password123"
   }
   ```

2. **Iniciar sesion**:
   ```
   POST /api/auth/login
   Body: {
     "email": "test@test.com",
     "password": "password123"
   }
   ```
   Copia el `token` de la respuesta.

3. **Configurar autenticacion**:
   - En cada request, ve a "Authorization"
   - Selecciona "Bearer Token"
   - Pega el token copiado

4. **Crear chat**:
   ```
   POST /api/chats
   Headers: Authorization: Bearer <token>
   Body: {
     "name": "Mi Chat",
     "isGroupChat": false,
     "participantIds": [1, 2]
   }
   ```

5. **Enviar mensaje**:
   ```
   POST /api/messages
   Headers: Authorization: Bearer <token>
   Body: {
     "chatId": 1,
     "content": "Hola!"
   }
   ```

---

## API Endpoints

### **Autenticacion**

```http
POST /api/auth/registro
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

```http
GET /api/auth/google
# Redirige a Google OAuth
```

```http
GET /api/auth/google/callback
# Callback de Google OAuth
```

### **Chats**

```http
POST /api/chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string (opcional)",
  "isGroupChat": boolean,
  "participantIds": [number]
}
```

```http
GET /api/chats
Authorization: Bearer <token>
# Retorna todos los chats del usuario
```

```http
GET /api/chats/:chatId
Authorization: Bearer <token>
# Retorna informacion del chat
```

```http
PUT /api/chats/:chatId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string"
}
```

```http
DELETE /api/chats/:chatId
Authorization: Bearer <token>
# Elimina el chat
```

```http
POST /api/chats/:chatId/participants
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": number
}
```

### **Mensajes**

```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatId": number,
  "content": "string"
}
```

```http
GET /api/chats/:chatId/messages
Authorization: Bearer <token>
# Retorna mensajes del chat
```

```http
GET /api/messages/:messageId
Authorization: Bearer <token>
# Retorna mensaje especifico
```

```http
PUT /api/messages/:messageId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "string"
}
```

```http
DELETE /api/messages/:messageId
Authorization: Bearer <token>
# Elimina el mensaje
```

---

## Socket.IO Eventos

### **Conexion**

```javascript
// Cliente se conecta con token JWT
const socket = io('http://localhost:3000', {
  auth: {
    token: 'tu_jwt_token_aqui'
  }
});
```

### **Eventos Cliente → Servidor**

| Evento | Parametros | Descripcion |
|--------|-----------|-------------|
| `join_chat` | `chatId: number` | Unirse a un chat |
| `leave_chat` | `chatId: number` | Salir de un chat |
| `send_message` | `{ chatId: number, content: string }` | Enviar mensaje |
| `typing` | `{ chatId: number, isTyping: boolean }` | Notificar escritura |
| `get_messages` | `chatId: number` | Obtener mensajes |
| `get_chat_info` | `chatId: number` | Obtener info del chat |

### **Eventos Servidor → Cliente**

| Evento | Datos | Descripcion |
|--------|-------|-------------|
| `joined_chat` | `{ chatId: number }` | Confirmacion de union |
| `new_message` | `Message` | Nuevo mensaje recibido |
| `user_typing` | `{ userId: number, username: string, isTyping: boolean }` | Usuario escribiendo |
| `user_joined` | `{ userId: number, username: string }` | Usuario se unio |
| `user_left` | `{ userId: number, username: string }` | Usuario salio |
| `messages_loaded` | `Message[]` | Historial de mensajes |
| `chat_info` | `Chat` | Informacion del chat |
| `error` | `{ message: string }` | Error |

### **Ejemplo de Uso**

```javascript
// Unirse a un chat
socket.emit('join_chat', 1);

// Escuchar confirmacion
socket.on('joined_chat', (data) => {
  console.log('Unido al chat:', data.chatId);
});

// Enviar mensaje
socket.emit('send_message', {
  chatId: 1,
  content: 'Hola!'
});

// Recibir mensajes
socket.on('new_message', (message) => {
  console.log('Nuevo mensaje:', message);
});

// Notificar que estas escribiendo
socket.emit('typing', {
  chatId: 1,
  isTyping: true
});

// Ver cuando otros escriben
socket.on('user_typing', (data) => {
  if (data.isTyping) {
    console.log(`${data.username} esta escribiendo...`);
  }
});
```

