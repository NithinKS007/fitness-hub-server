import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { FindChatDTO } from "@application/dtos/chat-dtos";
import { Chat } from "@domain/entities/chat.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetChatHistoryUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class GetChatHistoryUseCase implements IGetChatHistoryUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}

  async execute(dtos: FindChatDTO): Promise<Chat[]> {
    const chatData = await this.chatRepository.getChatHistory(dtos);
    if (!chatData) {
      throw new validationError(ChatStatus.FailedToGetChatMessages);
    }
    return chatData;
  }
}
