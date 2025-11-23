import { Request, Response } from "express";
import { RegistroDto, LoginDto } from "../dtos/auth.dto";
import { registro, login } from "../services/auth.service";

export const registroController = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const resultado = await registro({ username, email, password });
        
        // verificamos si el usuario ya existe
        if (resultado.status === 400) {
            return res.status(400).send({
                message: resultado.message,
                status: 400
            });
        }
        
        res.send(resultado);
    } catch (error) {
        console.log("error en registroController:", error);
        res.status(500).send({
            message: "error al registrar el usuario",
            status: 500
        });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const resultado = await login({ email, password });
        
        res.send({
            message: "inicio de sesion exitoso",
            status: 200,
            data: resultado
        });
    } catch (error: any) {
        console.log("error en loginController:", error);
    
        res.send({
            message: "error en login",
            status: 500
        });
    }
};
