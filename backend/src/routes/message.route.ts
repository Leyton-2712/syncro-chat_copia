import { Router } from "express";
import { 
    crearMensajeController, 
    obtenerMensajesController, 
    obtenerMensajeController, 
    actualizarMensajeController, 
    eliminarMensajeController 
} from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { verificarMiembroDelChat } from "../middlewares/chat.middleware";

const router = Router();

// todas las rutas requieren autenticacion
router.post("/messages", authMiddleware, crearMensajeController);

router.get("/chats/:chatId/messages", authMiddleware, verificarMiembroDelChat, obtenerMensajesController);

router.get("/messages/:messageId", authMiddleware, obtenerMensajeController);

router.put("/messages/:messageId", authMiddleware, actualizarMensajeController);

router.delete("/messages/:messageId", authMiddleware, eliminarMensajeController);

export default router;
