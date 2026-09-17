import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { UpdateLastMessage } from "@application/dtos/conversation-dtos";
import { ChatLastMsg } from "@application/dtos/chat-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IUpdateLastMessageUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class UpdateLastMessageUseCase implements IUpdateLastMessageUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}

  async execute({
    userId,
    otherUserId,
    lastMessageId,
  }: UpdateLastMessage): Promise<ChatLastMsg> {
    const updatedConversation = await this.chatRepository.updateLastMessage({
      userId,
      otherUserId,
      lastMessageId,
    });
    if (!updatedConversation) {
      throw new validationError(ChatStatus.FailedToUpdateLastMessage);
    }

    const { id: conversationId } = updatedConversation;
    const chatWithLastMessage = await this.chatRepository.findChatWithLastMessage(
      conversationId
    );

    if (!chatWithLastMessage) {
      throw new validationError(ChatStatus.FailedToUpdateLastMessage);
    }
    return chatWithLastMessage;
  }
}
