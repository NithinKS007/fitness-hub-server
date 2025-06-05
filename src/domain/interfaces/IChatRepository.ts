import { FindChatDTO } from "../../application/dtos/chat-dtos";
import { IChat } from "../../infrastructure/databases/models/chat.model";
import { Chat } from "../entities/chat.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IChatRepository extends IBaseRepository<IChat> {
  getChatHistory (findChatDetails: FindChatDTO): Promise<Chat[]>;
  findUnreadMessages(userId: string, receiverId: string): Promise<Chat[]>;
  markMessagesRead(userId: string, receiverId: string): Promise<void>;
}
