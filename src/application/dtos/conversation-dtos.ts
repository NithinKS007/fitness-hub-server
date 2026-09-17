export interface FindConversation {
  userId: string;
  trainerId: string;
}

export interface UpdateUnReadMessageCount {
  userId: string;
  otherUserId: string;
  count: number;
}

export type IncrementUnReadMessageCount = Omit<UpdateUnReadMessageCount, "count">;

export interface UpdateLastMessage {
  userId: string;
  otherUserId: string;
  lastMessageId: string;
}
