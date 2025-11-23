import { Router } from "express";
import { 
    crearChatController, 
    obtenerChatsController, 
    obtenerChatController, 
    actualizarChatController, 
    eliminarChatController,
    agregarParticipanteController 
} from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { verificarMiembroDelChat } from "../middlewares/chat.middleware";

const router = Router();

// todas las rutas requieren autenticacion
router.post("/chats", authMiddleware, crearChatController);

router.get("/chats", authMiddleware, obtenerChatsController);

router.get("/chats/:chatId", authMiddleware, verificarMiembroDelChat, obtenerChatController);

router.put("/chats/:chatId", authMiddleware, verificarMiembroDelChat, actualizarChatController);

router.delete("/chats/:chatId", authMiddleware, verificarMiembroDelChat, eliminarChatController);

router.post("/chats/:chatId/participants", authMiddleware, verificarMiembroDelChat, agregarParticipanteController);

export default router;
