import mongoose from "mongoose";
import {
  CreateChatDTO,
  FindChatDTO,
} from "../../../application/dtos/chat-dtos";
import { Chat } from "../../../domain/entities/chat.entities";
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
import chatModel from "../models/chat.model";

export class ChatRepository implements IChatRepository {
  async saveChat(createChatDto: CreateChatDTO): Promise<Chat> {
    const chatToSave = {
      ...createChatDto,
      senderId: new mongoose.Types.ObjectId(createChatDto.senderId),
      receiverId: new mongoose.Types.ObjectId(createChatDto.receiverId),
    };

    return await chatModel.create(chatToSave);
  }
  async getMessagesBetween2users({
    userId,
    otherUserId,
  }: FindChatDTO): Promise<Chat[]> {
    const chats = await chatModel
      .find({
        $or: [
          {
            senderId: new mongoose.Types.ObjectId(userId),
            receiverId: new mongoose.Types.ObjectId(otherUserId),
          },
          {
            senderId: new mongoose.Types.ObjectId(otherUserId),
            receiverId: new mongoose.Types.ObjectId(userId),
          },
        ],
      })
      .sort({ createdAt: 1 });
    return chats;
  }

  async markAsRead(userId: string, receiverId: string): Promise<Chat[] | null> {
    const unreadMessages = await chatModel.find({
      senderId: new mongoose.Types.ObjectId(receiverId),
      receiverId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    });
    if (unreadMessages.length === 0) {
      return null;
    }
    await chatModel.updateMany(
      {
        senderId: new mongoose.Types.ObjectId(receiverId),
        receiverId: new mongoose.Types.ObjectId(userId),
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    return unreadMessages;
  }
}
