import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { IncrementUnReadMessageCount } from "@application/dtos/conversation-dtos";
import { Conversation } from "@application/dtos/chat-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

@injectable()
export class IncrementUnReadMessageCountUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}
  
  async execute({
    userId,
    otherUserId,
  }: IncrementUnReadMessageCount): Promise<Conversation> {
    const incrementUnReadMessageDoc =
      await this.conversationRepository.incrementUnReadMessageCount({
        userId,
        otherUserId,
      });

    if (!incrementUnReadMessageDoc) {
      throw new validationError(ChatStatus.FailedtoUpdateUnReadCount);
    }
    const updatedMessageDoc =
      await this.conversationRepository.findChatWithLastMessage(
        String(incrementUnReadMessageDoc._id)
      );
    return updatedMessageDoc;
  }
}
