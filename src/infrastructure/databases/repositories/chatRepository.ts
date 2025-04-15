import { CreateChatDTO, FindChatDTO } from "../../../application/dtos/chatDTOs";
import { Chat } from "../../../domain/entities/chatEntity";
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
import chatModel from "../models/chatModel";

export class MongoChatRepository implements IChatRepository {
  public async saveChat(createChat: CreateChatDTO): Promise<Chat> {
    return await chatModel.create(createChat);
  }
  public async getMessagesBetween2users({
    userId,
    otherUserId,
  }: FindChatDTO): Promise<Chat[]> {
    const chats = await chatModel
      .find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      })
      .sort({ createdAt: 1 });
    return chats;
  }
}
