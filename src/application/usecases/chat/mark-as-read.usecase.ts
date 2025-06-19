import { IChat } from "@domain/entities/chat.entity";
import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { TYPES_REPOSITORIES } from "di/types-repositories";
import { injectable, inject } from "inversify";

@injectable()
export class MarkMessageAsReadUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}
  
  async execute({
    userId,
    otherUserId,
  }: {
    userId: string;
    otherUserId: string;
  }): Promise<IChat[] | null> {
    const unreadMessages = await this.chatRepository.findUnreadMessages(
      userId,
      otherUserId
    );
    if (unreadMessages.length > 0) {
      await this.chatRepository.markMessagesRead(userId, otherUserId);
      return unreadMessages;
    }
    return null;
  }
}
