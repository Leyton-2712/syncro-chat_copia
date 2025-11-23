export interface MessageResponse {
    id: number;
    content: string;
    messageType: string;
    createdAt: Date;
    senderId: number;
    chatId: number;
    sender?: {
        id: number;
        username: string;
    };
}
