import { Router } from "express";
import { loginController, registroController } from "../controllers/auth.controller";

const router = Router();

router.post("/registro", registroController);

router.post("/login", loginController);

export default router;