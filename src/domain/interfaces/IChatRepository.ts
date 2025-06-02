import { CreateChatDTO, FindChatDTO } from "../../application/dtos/chat-dtos";
import { Chat } from "../entities/chat.entities";

export interface IChatRepository {
  saveChat(createChat: CreateChatDTO): Promise<Chat>;
  getMessagesBetween2users(findChatDetails: FindChatDTO): Promise<Chat[]>;
  markAsRead(senderId: string, receiverId: string): Promise<Chat[] | null>;
}
