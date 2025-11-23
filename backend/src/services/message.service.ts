import prisma from "../db/prisma";
import { CreateMessageDto, UpdateMessageDto } from "../dtos/message.dto";
import { emitMessageUpdated, emitMessageDeleted } from "../sockets/socket.utils";

// crear un nuevo mensaje
export const crearMensaje = async (dto: CreateMessageDto, senderId: number) => {
    try {
        // Si es el chat global (ID 1), permitir a todos
        // Para otros chats, verificar que sea participante
        if (dto.chatId !== 1) {
            const participante = await prisma.chatParticipant.findFirst({
                where: {
                    chatId: dto.chatId,
                    userId: senderId
                }
            });

            if (!participante) {
                return {
                    message: "no perteneces a este chat",
                    status: 403
                };
            }
        }

        const mensaje = await prisma.message.create({
            data: {
                content: dto.content,
                messageType: dto.messageType || "text",
                senderId: senderId,
                chatId: dto.chatId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        // Transformar la estructura para que sea consistente con el frontend
        const messageFormatted = {
            id: mensaje.id,
            content: mensaje.content,
            userId: mensaje.senderId,
            username: mensaje.sender.username,
            chatId: mensaje.chatId,
            createdAt: mensaje.createdAt
        };

        return {
            message: "mensaje enviado exitosamente",
            status: 201,
            data: messageFormatted
        };
    } catch (error) {
        console.log("error en crearMensaje:", error);
        return {
            message: "error al enviar el mensaje",
            status: 500
        };
    }
};

// obtener mensajes de un chat
export const obtenerMensajesDelChat = async (chatId: number, userId: number) => {
    try {
        // Si es el chat global (ID 1), permitir acceso a todos
        // Para otros chats, verificar que sea participante
        if (chatId !== 1) {
            const participante = await prisma.chatParticipant.findFirst({
                where: {
                    chatId: chatId,
                    userId: userId
                }
            });

            if (!participante) {
                return {
                    message: "no tienes acceso a este chat",
                    status: 403
                };
            }
        }

        const mensajes = await prisma.message.findMany({
            where: {
                chatId: chatId
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        // Transformar la estructura para que sea consistente con el frontend
        const mensajesFormateados = mensajes.map(msg => ({
            id: msg.id,
            content: msg.content,
            userId: msg.senderId,
            username: msg.sender.username,
            chatId: msg.chatId,
            createdAt: msg.createdAt
        }));

        return {
            message: "mensajes obtenidos exitosamente",
            status: 200,
            data: mensajesFormateados
        };
    } catch (error) {
        console.log("error en obtenerMensajesDelChat:", error);
        return {
            message: "error al obtener los mensajes",
            status: 500
        };
    }
};

// obtener un mensaje por id
export const obtenerMensajePorId = async (messageId: number, userId: number) => {
    try {
        const mensaje = await prisma.message.findUnique({
            where: {
                id: messageId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                chat: true
            }
        });

        if (!mensaje) {
            return {
                message: "mensaje no encontrado",
                status: 404
            };
        }

        // verificar que el usuario sea participante del chat
        const participante = await prisma.chatParticipant.findFirst({
            where: {
                chatId: mensaje.chatId,
                userId: userId
            }
        });

        if (!participante) {
            return {
                message: "no tienes acceso a este mensaje",
                status: 403
            };
        }

        return {
            message: "mensaje obtenido exitosamente",
            status: 200,
            data: mensaje
        };
    } catch (error) {
        console.log("error en obtenerMensajePorId:", error);
        return {
            message: "error al obtener el mensaje",
            status: 500
        };
    }
};

// actualizar un mensaje
export const actualizarMensaje = async (messageId: number, dto: UpdateMessageDto, userId: number) => {
    try {
        const mensajeExistente = await prisma.message.findUnique({
            where: {
                id: messageId
            }
        });

        if (!mensajeExistente) {
            return {
                message: "mensaje no encontrado",
                status: 404
            };
        }

        // verificar que el usuario sea el remitente del mensaje
        if (mensajeExistente.senderId !== userId) {
            return {
                message: "solo puedes editar tus propios mensajes",
                status: 403
            };
        }

        const mensaje = await prisma.message.update({
            where: {
                id: messageId
            },
            data: {
                content: dto.content
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        // emitir evento de socket
        emitMessageUpdated(mensajeExistente.chatId, mensaje);

        return {
            message: "mensaje actualizado exitosamente",
            status: 200,
            data: mensaje
        };
    } catch (error) {
        console.log("error en actualizarMensaje:", error);
        return {
            message: "error al actualizar el mensaje",
            status: 500
        };
    }
};

// eliminar un mensaje
export const eliminarMensaje = async (messageId: number, userId: number) => {
    try {
        const mensajeExistente = await prisma.message.findUnique({
            where: {
                id: messageId
            }
        });

        if (!mensajeExistente) {
            return {
                message: "mensaje no encontrado",
                status: 404
            };
        }

        // verificar que el usuario sea el remitente del mensaje
        if (mensajeExistente.senderId !== userId) {
            return {
                message: "solo puedes eliminar tus propios mensajes",
                status: 403
            };
        }

        const chatId = mensajeExistente.chatId;
        
        await prisma.message.delete({
            where: {
                id: messageId
            }
        });

        // emitir evento de socket
        emitMessageDeleted(chatId, messageId);

        return {
            message: "mensaje eliminado exitosamente",
            status: 200
        };
    } catch (error) {
        console.log("error en eliminarMensaje:", error);
        return {
            message: "error al eliminar el mensaje",
            status: 500
        };
    }
};
