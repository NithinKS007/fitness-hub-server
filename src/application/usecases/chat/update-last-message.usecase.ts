import { Conversation } from "../../../domain/entities/conversation.entities";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ChatStatus } from "../../../shared/constants/index.constants";
import { UpdateLastMessage } from "../../dtos/conversation-dtos";

export class UpdateLastMessageUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
  async execute({
    userId,
    otherUserId,
    lastMessageId,
  }: UpdateLastMessage): Promise<Conversation> {
    const lastMessage = await this.conversationRepository.updateLastMessage({
      userId,
      otherUserId,
      lastMessageId,
    });
    if (!lastMessage) {
      throw new validationError(ChatStatus.FailedToUpdateLastMessage);
    }
    return lastMessage;
  }
}
