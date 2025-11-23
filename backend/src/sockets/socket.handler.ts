import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces/auth.interface";
import { crearMensaje, obtenerMensajesDelChat } from "../services/message.service";
import { obtenerChatPorId } from "../services/chat.service";
import prisma from "../db/prisma";

const jwtSecret = process.env.JWT_SECRET || "holaMundo2025";

interface SocketWithUser extends Socket {
    userId?: number;
    username?: string;
}

export const configurarSocketIO = (io: Server) => {
    // middleware para autenticar socket
    io.use(async (socket: SocketWithUser, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
            
            if (!token) {
                return next(new Error("token no encontrado"));
            }

            const payload = jwt.verify(token, jwtSecret) as TokenPayload;
            socket.userId = payload.id;
            socket.username = payload.username;
            next();
        } catch (error) {
            console.log("error en autenticacion de socket:", error);
            next(new Error("token invalido"));
        }
    });

    io.on("connection", (socket: SocketWithUser) => {
        console.log(`usuario conectado: ${socket.username} (${socket.userId})`);

        // Emitir a todos que un usuario se conectó (para el chat global)
        socket.broadcast.emit("user_connected", {
            username: socket.username,
            userId: socket.userId
        });

        // unirse a un chat
        socket.on("join_chat", async (chatId: number) => {
            try {
                if (!socket.userId) return;

                // Si es el chat global (ID 1), permitir acceso a todos
                // Para otros chats, verificar que sea miembro
                if (chatId !== 1) {
                    const participante = await prisma.chatParticipant.findFirst({
                        where: {
                            chatId: chatId,
                            userId: socket.userId
                        }
                    });

                    if (!participante) {
                        socket.emit("error", { message: "no tienes acceso a este chat" });
                        return;
                    }
                }

                // unirse a la sala del chat
                socket.join(`chat_${chatId}`);
                console.log(`${socket.username} se unio al chat ${chatId}`);

                // notificar a otros usuarios
                socket.to(`chat_${chatId}`).emit("user_joined", {
                    userId: socket.userId,
                    username: socket.username,
                    chatId: chatId
                });

                // enviar confirmacion
                socket.emit("joined_chat", { chatId: chatId });
            } catch (error) {
                console.log("error en join_chat:", error);
                socket.emit("error", { message: "error al unirse al chat" });
            }
        });

        // salir de un chat
        socket.on("leave_chat", (chatId: number) => {
            socket.leave(`chat_${chatId}`);
            console.log(`${socket.username} salio del chat ${chatId}`);

            // notificar a otros usuarios
            socket.to(`chat_${chatId}`).emit("user_left", {
                userId: socket.userId,
                username: socket.username,
                chatId: chatId
            });
        });

        // enviar mensaje
        socket.on("send_message", async (data: { chatId: number; content: string; messageType?: string }) => {
            try {
                if (!socket.userId) return;

                const resultado = await crearMensaje(
                    {
                        chatId: data.chatId,
                        content: data.content,
                        messageType: data.messageType || "text"
                    },
                    socket.userId
                );

                if (resultado.status === 201) {
                    // emitir mensaje a todos en el chat
                    io.to(`chat_${data.chatId}`).emit("new_message", resultado.data);
                } else {
                    socket.emit("error", { message: resultado.message });
                }
            } catch (error) {
                console.log("error en send_message:", error);
                socket.emit("error", { message: "error al enviar mensaje" });
            }
        });

        // usuario esta escribiendo
        socket.on("typing", (data: { chatId: number; isTyping: boolean }) => {
            socket.to(`chat_${data.chatId}`).emit("user_typing", {
                userId: socket.userId,
                username: socket.username,
                chatId: data.chatId,
                isTyping: data.isTyping
            });
        });

        // marcar mensajes como leidos
        socket.on("mark_as_read", async (data: { chatId: number; messageId: number }) => {
            try {
                // emitir a otros usuarios que el mensaje fue leido
                socket.to(`chat_${data.chatId}`).emit("message_read", {
                    userId: socket.userId,
                    chatId: data.chatId,
                    messageId: data.messageId
                });
            } catch (error) {
                console.log("error en mark_as_read:", error);
            }
        });

        // obtener mensajes del chat
        socket.on("get_messages", async (chatId: number) => {
            try {
                if (!socket.userId) return;

                const resultado = await obtenerMensajesDelChat(chatId, socket.userId);
                
                if (resultado.status === 200) {
                    socket.emit("messages_loaded", resultado.data);
                } else {
                    socket.emit("error", { message: resultado.message });
                }
            } catch (error) {
                console.log("error en get_messages:", error);
                socket.emit("error", { message: "error al obtener mensajes" });
            }
        });

        // obtener informacion del chat
        socket.on("get_chat_info", async (chatId: number) => {
            try {
                if (!socket.userId) return;

                const resultado = await obtenerChatPorId(chatId, socket.userId);
                
                if (resultado.status === 200) {
                    socket.emit("chat_info", resultado.data);
                } else {
                    socket.emit("error", { message: resultado.message });
                }
            } catch (error) {
                console.log("error en get_chat_info:", error);
                socket.emit("error", { message: "error al obtener informacion del chat" });
            }
        });

        // desconexion
        socket.on("disconnect", () => {
            console.log(`usuario desconectado: ${socket.username} (${socket.userId})`);
            
            // Emitir a todos que un usuario se desconectó
            socket.broadcast.emit("user_disconnected", {
                username: socket.username,
                userId: socket.userId
            });
        });
    });
};

// instancia global de io para usar en otros archivos
let ioInstance: Server | null = null;

export const setIOInstance = (io: Server) => {
    ioInstance = io;
};

export const getIOInstance = (): Server | null => {
    return ioInstance;
};
