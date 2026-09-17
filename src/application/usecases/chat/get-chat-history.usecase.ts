import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { InternalServerError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { FindMessageDTO } from "@application/dtos/chat-dtos";
import { Message } from "@domain/entities/message.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetChatHistoryUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class GetChatHistoryUseCase implements IGetChatHistoryUC {
  constructor(
    @inject(TYPES_REPOSITORIES.MessageRepository)
    private chatRepository: IMessageRepository
  ) {}

  async execute({ otherUserId, userId, limit, page }: FindMessageDTO): Promise<Message[]> {
    const query = { otherUserId, userId, limit, page };
    const chatData = await this.chatRepository.getChatHistory(query);
    if (!chatData) {
      throw new InternalServerError(ChatStatus.FailedToGetChatMessages);
    }
    return chatData;
  }
}
