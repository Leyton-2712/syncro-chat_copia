import { Request, Response } from "express";
import { 
    crearChat, 
    obtenerChatsDelUsuario, 
    obtenerChatPorId, 
    actualizarChat, 
    eliminarChat,
    agregarParticipante 
} from "../services/chat.service";
import { CreateChatDto, UpdateChatDto, AddParticipantDto } from "../dtos/chat.dto";

export const crearChatController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const dto: CreateChatDto = req.body;
        const resultado = await crearChat(dto, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en crearChatController:", error);
        res.status(500).send({
            message: "error al crear el chat",
            status: 500
        });
    }
};

// obtener todos los chats del usuario
export const obtenerChatsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const resultado = await obtenerChatsDelUsuario(userId);
        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en obtenerChatsController:", error);
        res.status(500).send({
            message: "error al obtener los chats",
            status: 500
        });
    }
};

// obtener un chat por id
export const obtenerChatController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const chatId = req.params.chatId ? parseInt(req.params.chatId) : 0;
        const resultado = await obtenerChatPorId(chatId, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en obtenerChatController:", error);
        res.status(500).send({
            message: "error al obtener el chat",
            status: 500
        });
    }
};

// actualizar un chat
export const actualizarChatController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const chatId = req.params.chatId ? parseInt(req.params.chatId) : 0;
        const dto: UpdateChatDto = req.body;
        const resultado = await actualizarChat(chatId, dto, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en actualizarChatController:", error);
        res.status(500).send({
            message: "error al actualizar el chat",
            status: 500
        });
    }
};

// eliminar un chat
export const eliminarChatController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const chatId = req.params.chatId ? parseInt(req.params.chatId) : 0;
        const resultado = await eliminarChat(chatId, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en eliminarChatController:", error);
        res.status(500).send({
            message: "error al eliminar el chat",
            status: 500
        });
    }
};

// agregar participante a un chat
export const agregarParticipanteController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({
                message: "no autenticado",
                status: 401
            });
        }

        const chatId = req.params.chatId ? parseInt(req.params.chatId) : 0;
        const dto: AddParticipantDto = req.body;
        const resultado = await agregarParticipante(chatId, dto, userId);

        res.status(resultado.status).send(resultado);
    } catch (error) {
        console.log("error en agregarParticipanteController:", error);
        res.status(500).send({
            message: "error al agregar participante",
            status: 500
        });
    }
};
