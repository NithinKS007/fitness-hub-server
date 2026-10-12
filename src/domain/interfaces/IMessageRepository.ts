import { FindMessageDTO } from "@application/dtos/chat-dtos";
import { Message } from "@domain/entities/message.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IMessageRepository extends IBaseRepository<Message> {
  getChatHistory(findChatDetails: FindMessageDTO): Promise<Message[]>;
  markMessagesRead(userId: string, receiverId: string): Promise<void>;
}
