export interface FindConversation {
  userId: string;
  trainerId: string;
}

export interface UpdateUnReadMessageCount {
  userId: string;
  otherUserId: string;
  count: number;
}

export interface IncrementUnReadMessageCount {
  userId: string;
  otherUserId: string;
}

export interface UpdateLastMessage {
  userId: string;
  otherUserId: string;
  lastMessageId: string;
}
