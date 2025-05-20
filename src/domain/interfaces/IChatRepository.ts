import { CreateChatDTO, FindChatDTO } from "../../application/dtos/chat-dtos";
import { IdDTO } from "../../application/dtos/utility-dtos";
import { Chat } from "../entities/chat";

export interface IChatRepository {
  saveChat(createChat: CreateChatDTO): Promise<Chat>;
  getMessagesBetween2users(findChatDetails: FindChatDTO): Promise<Chat[]>;
  markAsRead(senderId: IdDTO, receiverId: IdDTO): Promise<Chat[] | null>;
}
