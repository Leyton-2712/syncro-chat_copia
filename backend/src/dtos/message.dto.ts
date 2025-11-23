export interface CreateMessageDto {
    content: string;
    chatId: number;
    messageType?: string;
}

export interface UpdateMessageDto {
    content: string;
}
