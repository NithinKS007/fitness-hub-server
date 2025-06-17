import { IChat } from "@domain/entities/chat.entity";
import { IChatRepository } from "@domain/interfaces/IChatRepository";

export class MarkMessageAsReadUseCase {
  constructor(private chatRepository: IChatRepository) {}
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
