import { Model } from "mongoose";
import { FindChatDTO } from "@application/dtos/chat-dtos";
import { IChatRepository } from "@domain/interfaces/IChatRepository";
import ChatModel from "@infrastructure/databases/models/chat.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IChat } from "@domain/entities/chat.entity";

export class ChatRepository
  extends BaseRepository<IChat>
  implements IChatRepository
{
  constructor(model: Model<IChat> = ChatModel) {
    super(model);
  }

  async getChatHistory({ userId, otherUserId }: FindChatDTO): Promise<IChat[]> {
    const chats = await this.model
      .find({
        $or: [
          {
            senderId: this.parseId(userId),
            receiverId: this.parseId(otherUserId),
          },
          {
            senderId: this.parseId(otherUserId),
            receiverId: this.parseId(userId),
          },
        ],
      })
      .sort({ createdAt: 1 });
    return chats;
  }

  async findUnreadMessages(
    userId: string,
    receiverId: string
  ): Promise<IChat[]> {
    return this.model.find({
      senderId: this.parseId(receiverId),
      receiverId: this.parseId(userId),
      isRead: false,
    });
  }

  async markMessagesRead(userId: string, receiverId: string): Promise<void> {
    await this.model.updateMany(
      {
        senderId: this.parseId(receiverId),
        receiverId: this.parseId(userId),
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );
  }
}
