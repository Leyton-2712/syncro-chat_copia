import { getIOInstance } from "./socket.handler";

// emitir evento de nuevo mensaje a todos en el chat
export const emitNewMessage = (chatId: number, message: any) => {
    const io = getIOInstance();
    if (io) {
        io.to(`chat_${chatId}`).emit("new_message", message);
    }
};

// emitir evento de chat actualizado
export const emitChatUpdated = (chatId: number, chat: any) => {
    const io = getIOInstance();
    if (io) {
        io.to(`chat_${chatId}`).emit("chat_updated", chat);
    }
};

// emitir evento de mensaje actualizado
export const emitMessageUpdated = (chatId: number, message: any) => {
    const io = getIOInstance();
    if (io) {
        io.to(`chat_${chatId}`).emit("message_updated", message);
    }
};

// emitir evento de mensaje eliminado
export const emitMessageDeleted = (chatId: number, messageId: number) => {
    const io = getIOInstance();
    if (io) {
        io.to(`chat_${chatId}`).emit("message_deleted", { messageId, chatId });
    }
};

// emitir evento de participante agregado
export const emitParticipantAdded = (chatId: number, participant: any) => {
    const io = getIOInstance();
    if (io) {
        io.to(`chat_${chatId}`).emit("participant_added", { chatId, participant });
    }
};
