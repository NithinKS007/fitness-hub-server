import { FindChatDTO } from "@application/dtos/chat-dtos";
import { IChat } from "@domain/entities/chat.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IChatRepository extends IBaseRepository<IChat> {
  getChatHistory(findChatDetails: FindChatDTO): Promise<IChat[]>;
  findUnreadMessages(userId: string, receiverId: string): Promise<IChat[]>;
  markMessagesRead(userId: string, receiverId: string): Promise<void>;
}
