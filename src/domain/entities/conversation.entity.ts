export interface Conversation {
  _id: string;
  userId: string;
  trainerId: string;
  lastMessage: string;
  unreadCount: number;
  stripeSubscriptionStatus: string;
}
