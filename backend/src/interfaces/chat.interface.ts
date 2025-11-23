export interface ChatResponse {
    id: number;
    name?: string;
    isGroupChat: boolean;
    participants?: ParticipantInfo[];
}

export interface ParticipantInfo {
    id: number;
    userId: number;
    isPinned: boolean;
    user?: {
        id: number;
        username: string;
        email: string;
    };
}

export interface ChatWithMessages {
    id: number;
    name?: string;
    isGroupChat: boolean;
    messages: MessageInfo[];
    participants: ParticipantInfo[];
}

export interface MessageInfo {
    id: number;
    content: string;
    messageType: string;
    createdAt: Date;
    senderId: number;
    sender?: {
        id: number;
        username: string;
    };
}
