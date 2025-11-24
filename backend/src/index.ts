import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import passport from "passport";
import routes from "./routes/route";
import bodyParser from "body-parser";
import cors from "cors";
import "./config/passport.config";
import { configurarSocketIO } from "./sockets/socket.handler";  // ✅ Cambiado
import path from "path";
import prisma from "./db/prisma";

dotenv.config();

// Función para asegurar que el chat general existe
const ensureGeneralChatExists = async () => {
    try {
        const generalChat = await prisma.chat.findUnique({
            where: { id: 1 }
        });

        if (!generalChat) {
            console.log("Creando chat general...");
            await prisma.chat.create({
                data: {
                    id: 1,
                    name: "General",
                    isGroupChat: true
                }
            });
            console.log("Chat general creado exitosamente");
        } else {
            console.log("Chat general ya existe");
        }
    } catch (error) {
        console.error("Error al asegurar la existencia del chat general:", error);
    }
};

const start = async () => {
    try {
        // Asegurar que el chat general existe
        await ensureGeneralChatExists();

        const app = express();
        const httpServer = createServer(app);
        const io = new Server(httpServer, {
            cors: {
                origin: [
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://syncro-chatcopia-production.up.railway.app",
                    "https://syncro-chat-front.vercel.app"  // ✅ AGREGAR ESTO
                ],
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        const puerto = process.env.PORT || 3000;
        
        // middlewares
        app.use(cors({
            origin: [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "https://syncro-chatcopia-production.up.railway.app",
                "https://syncro-chat-front.vercel.app"  // ✅ AGREGAR ESTO
            ],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"]
        }));
        app.use(bodyParser.json());
        app.use(passport.initialize());

        // rutas
        app.use("/", routes);

        // configurar socket.io
        configurarSocketIO(io);
        
        // guardar instancia de io para usar en otros archivos
        const { setIOInstance } = await import("./sockets/socket.handler");  // ✅ Cambiado
        setIOInstance(io);
        
        httpServer.listen(puerto, () => {
            console.log(`Servidor corriendo en el puerto: ${puerto}`);
            console.log(`URL: http://localhost:${puerto}`);
        });
    } catch (error) {
        console.log("Error al iniciar el servidor:", error);
    }
};

start();
