import { FindChatDTO } from "@application/dtos/chat-dtos";
import { Chat } from "@domain/entities/chat.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IChat } from "@infrastructure/databases/models/chat.model";

export interface IChatRepository extends IBaseRepository<IChat,Chat> {
  getChatHistory(findChatDetails: FindChatDTO): Promise<Chat[]>;
  findUnreadMessages(userId: string, receiverId: string): Promise<Chat[]>;
  markMessagesRead(userId: string, receiverId: string): Promise<void>;
}
