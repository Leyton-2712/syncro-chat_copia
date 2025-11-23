export interface IMessage {
    id_message?: string;
    id_user?: string;
    user_name: string;
    content: string;
    timestamp: Date;
    isOwnMessage?: boolean;
}