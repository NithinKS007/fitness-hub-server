import { Conversation } from "../../../domain/entities/conversation.entities";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { UpdateUnReadMessageCount } from "../../dtos/conversation-dtos";

export class UpdateUnReadMessageCountUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
  async execute({
    userId,
    otherUserId,
    count,
  }: UpdateUnReadMessageCount): Promise<Conversation | null> {
    const updatedUnReadMessage =
      await this.conversationRepository.updateUnReadCount({
        userId,
        otherUserId,
        count,
      });
    return updatedUnReadMessage;
  }
}
