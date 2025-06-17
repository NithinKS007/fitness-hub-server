import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { UpdateUnReadMessageCount } from "@application/dtos/conversation-dtos";
import { Conversation } from "@application/dtos/chat-dtos";

export class UpdateUnReadMessageCountUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
  async execute({
    userId,
    otherUserId,
    count,
  }: UpdateUnReadMessageCount): Promise<Conversation | null> {
    const conversationData =
      await this.conversationRepository.findChatUpdateCount(
        userId,
        otherUserId
      );

    if (conversationData) {
      const { _id: conversationId } = conversationData;

      const updatedMessageDoc = await this.conversationRepository.update(
        String(conversationId),
        {
          unreadCount: count,
        }
      );

      if (updatedMessageDoc) {
        const { _id: updatedMessageDocId } = updatedMessageDoc;

        const finalMessageDocument =
          await this.conversationRepository.findChatWithLastMessage(
            String(updatedMessageDocId)
          );
        return finalMessageDocument;
      }
    }
    return null;
  }
}
