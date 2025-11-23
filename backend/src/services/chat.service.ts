import prisma from "../db/prisma";
import { CreateChatDto, UpdateChatDto, AddParticipantDto } from "../dtos/chat.dto";
import { emitChatUpdated, emitParticipantAdded } from "../sockets/socket.utils";

export const crearChat = async (dto: CreateChatDto, creatorId: number) => {
    try {
        // verificar que el creador este en la lista de participantes
        const participantIds = [...new Set([creatorId, ...dto.participantIds])];

        const chat = await prisma.chat.create({
            data: {
                name: dto.name || null,
                isGroupChat: dto.isGroupChat,
                participants: {
                    create: participantIds.map(userId => ({
                        userId: userId
                    }))
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }//envio el chat creado con los participantes
        });

        return {
            message: "chat creado exitosamente",
            status: 201,
            data: chat
        };
    } catch (error) {
        console.log("error en crearChat:", error);
        return {
            message: "error al crear el chat",
            status: 500
        };
    }
};

export const obtenerChatsDelUsuario = async (userId: number) => {
    try {
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                },
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        return {
            message: "chats obtenidos exitosamente",
            status: 200,
            data: chats
        };
    } catch (error) {
        console.log("error en obtenerChatsDelUsuario:", error);
        return {
            message: "error al obtener los chats",
            status: 500
        };
    }
};

export const obtenerChatPorId = async (chatId: number, userId: number) => {
    try {
        // verificar que el usuario sea miembro del chat
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

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                }
            }
        });

        if (!chat) {
            return {
                message: "chat no encontrado",
                status: 404
            };
        }

        return {
            message: "chat obtenido exitosamente",
            status: 200,
            data: chat
        };
    } catch (error) {
        console.log("error en obtenerChatPorId:", error);
        return {
            message: "error al obtener el chat",
            status: 500
        };
    }
};

export const actualizarChat = async (chatId: number, dto: UpdateChatDto, userId: number) => {
    try {
        // verificar que el usuario sea miembro del chat
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

        const chat = await prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                name: dto.name || null
            }
        });

        // emitir evento de socket
        emitChatUpdated(chatId, chat);

        return {
            message: "chat actualizado exitosamente",
            status: 200,
            data: chat
        };
    } catch (error) {
        console.log("error en actualizarChat:", error);
        return {
            message: "error al actualizar el chat",
            status: 500
        };
    }
};

export const eliminarChat = async (chatId: number, userId: number) => {
    try {
        // verificamos que el usuario sea miembro del chat
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

        // eliminar mensajes antes de eliminar el chat si nos dara error
        await prisma.message.deleteMany({
            where: {
                chatId: chatId
            }
        });

        // eliminar participantes
        await prisma.chatParticipant.deleteMany({
            where: {
                chatId: chatId
            }
        });

        // eliminar el chat
        await prisma.chat.delete({
            where: {
                id: chatId
            }
        });

        return {
            message: "chat eliminado exitosamente",
            status: 200
        };
    } catch (error) {
        console.log("error en eliminarChat:", error);
        return {
            message: "error al eliminar el chat",
            status: 500
        };
    }
};

export const agregarParticipante = async (chatId: number, dto: AddParticipantDto, userId: number) => {
    try {
        // verificamos que el usuario sea miembro del chat
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

        // verificar que el usuario a agregar no este ya en el chat
        const participanteExistente = await prisma.chatParticipant.findFirst({
            where: {
                chatId: chatId,
                userId: dto.userId
            }
        });

        if (participanteExistente) {
            return {
                message: "el usuario ya es participante del chat",
                status: 400
            };
        }

        const nuevoParticipante = await prisma.chatParticipant.create({
            data: {
                chatId: chatId,
                userId: dto.userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        // emitir evento de socket
        emitParticipantAdded(chatId, nuevoParticipante);

        return {
            message: "participante agregado exitosamente",
            status: 201,
            data: nuevoParticipante
        };
    } catch (error) {
        console.log("error en agregarParticipante:", error);
        return {
            message: "error al agregar participante",
            status: 500
        };
    }
};
