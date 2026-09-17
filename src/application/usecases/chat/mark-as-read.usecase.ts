import { Message } from "@domain/entities/message.entity";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { injectable, inject } from "inversify";
import { IMarkMessageRead } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class MarkMessageReadUseCase implements IMarkMessageRead {
  constructor(
    @inject(TYPES_REPOSITORIES.MessageRepository)
    private chatRepository: IMessageRepository
  ) {}

  async execute({
    userId,
    otherUserId,
  }: {
    userId: string;
    otherUserId: string;
  }): Promise<Message[] | null> {
    const unreadMessages = await this.chatRepository.findAll({
      senderId: userId,
      receiverId: otherUserId,
      isRead: false,
    });
    
    if (unreadMessages.length > 0) {
      await this.chatRepository.markMessagesRead(userId, otherUserId);
      return unreadMessages;
    }
    return null;
  }
}
