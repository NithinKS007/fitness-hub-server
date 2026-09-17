export interface Chat {
  id: string;
  userId: string;
  trainerId: string;
  lastMessage: string;
  unreadCount: number;
  providerSubStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
