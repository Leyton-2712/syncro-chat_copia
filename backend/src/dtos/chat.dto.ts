export interface CreateChatDto {
    name?: string;
    isGroupChat: boolean;
    participantIds: number[];
}

export interface UpdateChatDto {
    name?: string;
}

export interface AddParticipantDto {
    userId: number;
}
