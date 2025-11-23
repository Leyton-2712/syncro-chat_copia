import { Router } from "express";
import passport from "passport";
import { googleCallbackController, googleLoginController, googleFailureController } from "../controllers/google.controller";

const router = Router();

// ruta para iniciar autenticacion con Google (flujo OAuth tradicional)
router.get("/google", 
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// callback de Google OAuth (flujo OAuth tradicional)
router.get("/google/callback", 
    passport.authenticate("google", { 
        session: false,
        failureRedirect: "/api/auth/google/failure"
    }),
    googleCallbackController
);

// ruta de fallo en Google Auth
router.get("/google/failure", googleFailureController);

// ruta POST para login desde frontend (flujo SPA)
router.post("/google/login", googleLoginController);

export default router;
