import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketProps {
    token?: string;
}

interface Message {
    id: number;
    content: string;
    userId: number;
    username: string;
    chatId: number;
    createdAt: string;
}

interface TypingData {
    userId: number;
    username: string;
    chatId: number;
    isTyping: boolean;
}

interface ErrorData {
    message: string;
}

interface UserData {
    userId: number;
    username: string;
    chatId: number;
}

export function useSocket({ token }: UseSocketProps) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    
    // Refs para guardar los callbacks
    const callbacksRef = useRef<{
        newMessage: ((message: Message) => void)[];
        messagesLoaded: ((messages: Message[]) => void)[];
        userTyping: ((data: TypingData) => void)[];
        error: ((error: ErrorData) => void)[];
        userJoined: ((data: UserData) => void)[];
        userLeft: ((data: UserData) => void)[];
    }>({
        newMessage: [],
        messagesLoaded: [],
        userTyping: [],
        error: [],
        userJoined: [],
        userLeft: []
    });

    useEffect(() => {
        if (!token) return;

        // Conectar a WebSocket
        socketRef.current = io("http://localhost:3000", {
            auth: {
                token: token
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: maxReconnectAttempts
        });

        socketRef.current.on("connect", () => {
            console.log("✅ Conectado a WebSocket");
            setIsConnected(true);
            reconnectAttempts.current = 0;
        });

        socketRef.current.on("connect_error", (error: Error) => {
            console.error("❌ Error de conexión WebSocket:", error);
            reconnectAttempts.current++;
        });

        socketRef.current.on("disconnect", () => {
            console.log("⚠️ Desconectado de WebSocket");
            setIsConnected(false);
        });

        // Registrar eventos una sola vez
        socketRef.current.on("new_message", (message: Message) => {
            callbacksRef.current.newMessage.forEach(cb => cb(message));
        });

        socketRef.current.on("messages_loaded", (messages: Message[]) => {
            callbacksRef.current.messagesLoaded.forEach(cb => cb(messages));
        });

        socketRef.current.on("user_typing", (data: TypingData) => {
            callbacksRef.current.userTyping.forEach(cb => cb(data));
        });

        socketRef.current.on("error", (error: ErrorData) => {
            callbacksRef.current.error.forEach(cb => cb(error));
        });

        socketRef.current.on("user_joined", (data: UserData) => {
            callbacksRef.current.userJoined.forEach(cb => cb(data));
        });

        socketRef.current.on("user_left", (data: UserData) => {
            callbacksRef.current.userLeft.forEach(cb => cb(data));
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [token]);

    // Unirse a un chat
    const joinChat = useCallback((cId: number) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("join_chat", cId);
            console.log(`📍 Unido al chat ${cId}`);
        }
    }, []);

    // Salir de un chat
    const leaveChat = useCallback((cId: number) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("leave_chat", cId);
            console.log(`👋 Salido del chat ${cId}`);
        }
    }, []);

    // Enviar mensaje
    const sendMessage = useCallback((cId: number, content: string) => {
        if (socketRef.current?.connected && content.trim()) {
            socketRef.current.emit("send_message", {
                chatId: cId,
                content: content.trim(),
                messageType: "text"
            });
            console.log("📤 Mensaje enviado");
        }
    }, []);

    // Indicador de escritura
    const setTyping = useCallback((cId: number, isTyping: boolean) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("typing", {
                chatId: cId,
                isTyping: isTyping
            });
        }
    }, []);

    // Obtener mensajes
    const getMessages = useCallback((cId: number) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("get_messages", cId);
            console.log("📥 Solicitando mensajes");
        }
    }, []);

    // Marcar como leído
    const markAsRead = useCallback((cId: number, messageId: number) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("mark_as_read", {
                chatId: cId,
                messageId: messageId
            });
        }
    }, []);

    // Listener para nuevos mensajes
    const onNewMessage = useCallback((callback: (message: Message) => void) => {
        callbacksRef.current.newMessage.push(callback);
        return () => {
            callbacksRef.current.newMessage = callbacksRef.current.newMessage.filter(cb => cb !== callback);
        };
    }, []);

    // Listener para mensajes cargados
    const onMessagesLoaded = useCallback((callback: (messages: Message[]) => void) => {
        callbacksRef.current.messagesLoaded.push(callback);
        return () => {
            callbacksRef.current.messagesLoaded = callbacksRef.current.messagesLoaded.filter(cb => cb !== callback);
        };
    }, []);

    // Listener para usuario escribiendo
    const onUserTyping = useCallback((callback: (data: TypingData) => void) => {
        callbacksRef.current.userTyping.push(callback);
        return () => {
            callbacksRef.current.userTyping = callbacksRef.current.userTyping.filter(cb => cb !== callback);
        };
    }, []);

    // Listener para errores
    const onError = useCallback((callback: (error: ErrorData) => void) => {
        callbacksRef.current.error.push(callback);
        return () => {
            callbacksRef.current.error = callbacksRef.current.error.filter(cb => cb !== callback);
        };
    }, []);

    // Listener para usuario conectado
    const onUserJoined = useCallback((callback: (data: UserData) => void) => {
        callbacksRef.current.userJoined.push(callback);
        return () => {
            callbacksRef.current.userJoined = callbacksRef.current.userJoined.filter(cb => cb !== callback);
        };
    }, []);

    // Listener para usuario desconectado
    const onUserLeft = useCallback((callback: (data: UserData) => void) => {
        callbacksRef.current.userLeft.push(callback);
        return () => {
            callbacksRef.current.userLeft = callbacksRef.current.userLeft.filter(cb => cb !== callback);
        };
    }, []);

    // Listener para usuario se unió al chat (evento de conexión)
    const onUserConnected = useCallback((callback: (data: { username: string; userId: number }) => void) => {
        if (socketRef.current) {
            socketRef.current.on("user_connected", callback);
        }
    }, []);

    // Listener para usuario se desconectó del chat (evento de desconexión)
    const onUserDisconnected = useCallback((callback: (data: { username: string; userId: number }) => void) => {
        if (socketRef.current) {
            socketRef.current.on("user_disconnected", callback);
        }
    }, []);

    return {
        joinChat,
        leaveChat,
        sendMessage,
        setTyping,
        getMessages,
        markAsRead,
        onNewMessage,
        onMessagesLoaded,
        onUserTyping,
        onError,
        onUserJoined,
        onUserLeft,
        onUserConnected,
        onUserDisconnected,
        isConnected
    };
}
