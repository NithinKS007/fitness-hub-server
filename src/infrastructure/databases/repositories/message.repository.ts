import { Model } from "mongoose";
import { FindMessageDTO } from "@application/dtos/chat-dtos";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import MessageModel, {
  IMessage,
} from "@infrastructure/databases/models/message.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { Message } from "@domain/entities/message.entity";

export class MessageRepository
  extends BaseRepository<IMessage, Message>
  implements IMessageRepository
{
  constructor(model: Model<IMessage> = MessageModel) {
    super(model);
  }

  async getChatHistory({
    userId,
    otherUserId,
    limit,
    page,
  }: FindMessageDTO): Promise<Message[]> {
    const parsedUserId = this.parseId(userId);
    const parsedOtherUserId = this.parseId(otherUserId);
    const query = this.model
      .find({
        $or: [
          {
            senderId: parsedUserId,
            receiverId: parsedOtherUserId,
          },
          {
            senderId: parsedOtherUserId,
            receiverId: parsedUserId,
          },
        ],
      })
      .sort({ createdAt: 1 });

    if (limit && page) {
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    const chats = await query;

    return chats.map((chat) => this.toDomain(chat));
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
