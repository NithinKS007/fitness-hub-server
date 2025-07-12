export interface Chat {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
