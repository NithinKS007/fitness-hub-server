import mongoose from "mongoose";
import {
  CountUnReadMessages,
  CreateChatDTO,
  FindChatDTO,
} from "../../../application/dtos/chatDTOs";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { Chat } from "../../../domain/entities/chatEntity";
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
import chatModel from "../models/chatModel";

export class MongoChatRepository implements IChatRepository {
  public async saveChat(createChatDto: CreateChatDTO): Promise<Chat> {
    const chatToSave = {
      ...createChatDto,
      senderId: new mongoose.Types.ObjectId(createChatDto.senderId),
      receiverId: new mongoose.Types.ObjectId(createChatDto.receiverId),
    };

    return await chatModel.create(chatToSave);
  }
  public async getMessagesBetween2users({
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

  public async markAsRead(
    userId: IdDTO,
    receiverId: IdDTO
  ): Promise<Chat[] | null> {
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
  // public async countUnReadMessages({
  //   senderId,
  //   receiverId,
  // }: CountUnReadMessages): Promise<number> {
  //   return await chatModel.countDocuments({
  //     senderId: senderId,
  //     receiverId: receiverId,
  //   });
  // }
}
