import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { UpdateLastMessage } from "@application/dtos/conversation-dtos";
import { Conversation } from "@application/dtos/chat-dtos";

export class UpdateLastMessageUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
  async execute({
    userId,
    otherUserId,
    lastMessageId,
  }: UpdateLastMessage): Promise<Conversation> {
    const updatedConversation =
      await this.conversationRepository.updateLastMessage({
        userId,
        otherUserId,
        lastMessageId,
      });
    if (!updatedConversation) {
      throw new validationError(ChatStatus.FailedToUpdateLastMessage);
    }

    const { _id: conversationId } = updatedConversation;
    const chatWithLastMessage =
      await this.conversationRepository.findChatWithLastMessage(
        String(conversationId)
      );

    if (!chatWithLastMessage) {
      throw new validationError(ChatStatus.FailedToUpdateLastMessage);
    }
    return chatWithLastMessage;
  }
}
