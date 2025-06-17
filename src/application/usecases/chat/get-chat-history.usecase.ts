import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { FindChatDTO } from "@application/dtos/chat-dtos";
import { IChat } from "@domain/entities/chat.entity";

export class GetChatHistoryUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute({ userId, otherUserId }: FindChatDTO): Promise<IChat[]> {
    const chatData = await this.chatRepository.getChatHistory({
      userId,
      otherUserId,
    });
    if (!chatData) {
      throw new validationError(ChatStatus.FailedToGetChatMessages);
    }
    return chatData;
  }
}
