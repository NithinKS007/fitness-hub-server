import { FindMessageDTO } from "@application/dtos/chat-dtos";
import { Message } from "@domain/entities/message.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IMessage } from "@infrastructure/databases/models/message.model";

export interface IMessageRepository extends IBaseRepository<IMessage, Message> {
  getChatHistory(findChatDetails: FindMessageDTO): Promise<Message[]>;
  markMessagesRead(userId: string, receiverId: string): Promise<void>;
}
