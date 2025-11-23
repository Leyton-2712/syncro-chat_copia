// eventos que el cliente puede enviar al servidor
export interface ClientToServerEvents {
    join_chat: (chatId: number) => void;
    leave_chat: (chatId: number) => void;
    send_message: (data: { chatId: number; content: string; messageType?: string }) => void;
    typing: (data: { chatId: number; isTyping: boolean }) => void;
    mark_as_read: (data: { chatId: number; messageId: number }) => void;
    get_messages: (chatId: number) => void;
    get_chat_info: (chatId: number) => void;
}

// eventos que el servidor puede enviar al cliente
export interface ServerToClientEvents {
    user_joined: (data: { userId: number; username: string; chatId: number }) => void;
    user_left: (data: { userId: number; username: string; chatId: number }) => void;
    new_message: (message: any) => void;
    user_typing: (data: { userId: number; username: string; chatId: number; isTyping: boolean }) => void;
    message_read: (data: { userId: number; chatId: number; messageId: number }) => void;
    messages_loaded: (messages: any[]) => void;
    chat_info: (chat: any) => void;
    joined_chat: (data: { chatId: number }) => void;
    error: (data: { message: string }) => void;
}
