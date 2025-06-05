import { Conversation } from "../../../domain/entities/conversation.entities";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ChatStatus } from "../../../shared/constants/index.constants";
import { IncrementUnReadMessageCount } from "../../dtos/conversation-dtos";

export class IncrementUnReadMessageCountUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
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
    return incrementUnReadMessageDoc;
  }
}
