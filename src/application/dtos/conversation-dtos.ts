export interface CreateConversation {
  userId: string;
  trainerId: string;
  stripeSubscriptionStatus: string;
}

export interface ConversationSubscriptionUpdate extends CreateConversation {}

export type FindConversation = Omit<
  CreateConversation,
  "stripeSubscriptionStatus"
>;

export interface UpdateUnReadMessageCount {
  userId: string;
  otherUserId: string;
  count: number;
}

export type IncrementUnReadMessageCount = Omit<
  UpdateUnReadMessageCount,
  "count"
>;

export interface UpdateLastMessage {
  userId: string;
  otherUserId: string;
  lastMessageId: string 
}
