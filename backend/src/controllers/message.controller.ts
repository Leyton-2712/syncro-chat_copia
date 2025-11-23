import { Request, Response } from "express";
import { 
    crearMensaje, 
    obtenerMensajesDelChat, 
    obtenerMensajePorId, 
    actualizarMensaje, 
    eliminarMensaje 
} from "../services/message.service";
import { CreateMessageDto, UpdateMessageDto } from "../dtos/message.dto";

export const crearMensajeController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const dto: CreateMessageDto = req.body;
        const resultado = await crearMensaje(dto, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en crearMensajeController:", error);
        res.status(500).send({
            message: "error al crear el mensaje",
            status: 500
        });
    }
};

// obtener mensajes de un chat
export const obtenerMensajesController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const chatId = req.params.chatId ? parseInt(req.params.chatId) : 0;
        const resultado = await obtenerMensajesDelChat(chatId, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en obtenerMensajesController:", error);
        res.status(500).send({
            message: "error al obtener los mensajes",
            status: 500
        });
    }
};

// obtener un mensaje por id
export const obtenerMensajeController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const messageId = req.params.messageId ? parseInt(req.params.messageId) : 0;
        const resultado = await obtenerMensajePorId(messageId, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en obtenerMensajeController:", error);
        res.status(500).send({
            message: "error al obtener el mensaje",
            status: 500
        });
    }
};

export const actualizarMensajeController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const messageId = req.params.messageId ? parseInt(req.params.messageId) : 0;
        const dto: UpdateMessageDto = req.body;
        const resultado = await actualizarMensaje(messageId, dto, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en actualizarMensajeController:", error);
        res.status(500).send({
            message: "error al actualizar el mensaje",
            status: 500
        });
    }
};

// eliminar un mensaje
export const eliminarMensajeController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const messageId = req.params.messageId ? parseInt(req.params.messageId) : 0;
        const resultado = await eliminarMensaje(messageId, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en eliminarMensajeController:", error);
        res.status(500).send({
            message: "error al eliminar el mensaje",
            status: 500
        });
    }
};
