import { Request, Response } from "express";
import { generarTokenGoogle, googleLoginFromToken } from "../services/google.service";

export const googleCallbackController = (req: Request, res: Response) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({
                message: "error de autenticacion",
                status: 401,
            });
        }
        
        // generamos el token JWT 
        const resultado = generarTokenGoogle(user);
        
        // enviamos la respuesta en JSON
        res.status(200).json({
            message: "Autenticación con Google exitosa",
            status: 200,
            data: resultado
        });
    } catch (error) {
        console.log("error en googleCallbackController:", error);
        res.status(500).json({
            message: "ocurrio un error durante la autenticacion con Google",
            status: 500
        });
    }
};

// Controlador para login desde frontend (recibe token de Google)
export const googleLoginController = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                message: "Token de Google no proporcionado",
                status: 400
            });
        }
        
        const resultado = await googleLoginFromToken(token);
        
        res.status(200).json({
            message: "Autenticación con Google exitosa",
            status: 200,
            data: resultado
        });
    } catch (error) {
        console.log("error en googleLoginController:", error);
        res.status(500).json({
            message: "ocurrio un error durante la autenticacion con Google",
            status: 500
        });
    }
};

// Controlador para errores en Google Auth
export const googleFailureController = (req: Request, res: Response) => {
    res.status(401).json({
        message: "Falló la autenticación con Google",
        status: 401
    });
};
