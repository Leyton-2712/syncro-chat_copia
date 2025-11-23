import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

// middleware para verificar si el usuario pertenece al chat
export const verificarMiembroDelChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const chatIdParam = req.params.chatId || req.body.chatId;
        const chatId = chatIdParam ? parseInt(chatIdParam) : null;

        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        if (!chatId) {
            return res.status(400).send({
                message: "chatId requerido",
                status: 400
            });
        }

        // verificamos si el usuario es participante del chat
        const participante = await prisma.chatParticipant.findFirst({
            where: {
                userId: userId,
                chatId: chatId
            }
        });

        if (!participante) {
            return res.status(403).send({
                message: "no tienes permiso para acceder a este chat",
                status: 403
            });
        }

        next();
    } catch (error) {
        console.log("error en verificarMiembroDelChat:", error);
        res.status(500).send({
            message: "error al verificar permisos",
            status: 500
        });
    }
};
