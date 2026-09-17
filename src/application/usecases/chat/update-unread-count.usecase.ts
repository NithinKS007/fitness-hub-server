import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { UpdateUnReadMessageCount } from "@application/dtos/conversation-dtos";
import { ChatLastMsg } from "@application/dtos/chat-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IUpdateUnReadMessageCountUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class UpdateUnReadMessageCountUseCase implements IUpdateUnReadMessageCountUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}

  async execute({
    userId,
    otherUserId,
    count,
  }: UpdateUnReadMessageCount): Promise<ChatLastMsg | null> {
    const conversationData = await this.chatRepository.findChatUpdateCount(
      userId,
      otherUserId
    );

    if (!conversationData) return null;

    const { id: conversationId } = conversationData;

    const updatedMessage = await this.chatRepository.update(String(conversationId), {
      unreadCount: count,
    });

    if (!updatedMessage) return null;

    const { id: updatedMessageId } = updatedMessage;

    const finalMessageDocument = await this.chatRepository.findChatWithLastMessage(
      String(updatedMessageId)
    );
    return finalMessageDocument;
  }
}
