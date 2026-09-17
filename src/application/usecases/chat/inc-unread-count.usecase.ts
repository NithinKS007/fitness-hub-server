import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { IncrementUnReadMessageCount } from "@application/dtos/conversation-dtos";
import { ChatLastMsg } from "@application/dtos/chat-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IIncrementUnReadMessageCountUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class IncrementUnReadMessageCountUseCase
  implements IIncrementUnReadMessageCountUC
{
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private ChatRepository: IChatRepository
  ) {}

  async execute({
    userId,
    otherUserId,
  }: IncrementUnReadMessageCount): Promise<ChatLastMsg> {
    const incUnReadMessage = await this.ChatRepository.incrementUnReadMessageCount({
      userId,
      otherUserId,
    });

    if (!incUnReadMessage) {
      throw new validationError(ChatStatus.FailedtoUpdateUnReadCount);
    }
    const updatedMessage = await this.ChatRepository.findChatWithLastMessage(
      incUnReadMessage.id
    );
    return updatedMessage;
  }
}
