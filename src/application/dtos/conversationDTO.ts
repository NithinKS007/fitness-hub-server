export interface CreateConversation {
  userId: string;
  trainerId: string;
  stripeSubscriptionStatus: string;
}

export interface ConversationSubscriptionUpdate extends CreateConversation {}

export type FindConversation = Omit<CreateConversation, 'stripeSubscriptionStatus'>;
export type UpdateUnReadMessageCount = Omit<CreateConversation, 'stripeSubscriptionStatus'> & {
  count: number;
};
export interface UpdateLastMessage {
  userId:string
  otherUserId:string,
  message:string
}