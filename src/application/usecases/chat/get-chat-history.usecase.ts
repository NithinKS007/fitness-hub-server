import { Chat } from "../../../domain/entities/chat.entities";
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ChatStatus } from "../../../shared/constants/index.constants";
import { FindChatDTO } from "../../dtos/chat-dtos";

export class GetChatHistoryUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute({ userId, otherUserId }: FindChatDTO): Promise<Chat[]> {
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
