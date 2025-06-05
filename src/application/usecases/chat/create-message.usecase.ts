import { Chat } from "../../../domain/entities/chat.entities";
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ChatStatus } from "../../../shared/constants/index.constants";
import { CreateChatDTO } from "../../dtos/chat-dtos";

export class CreateMessageUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute(createChat: CreateChatDTO): Promise<Chat> {
    const createdMessage = await this.chatRepository.create(createChat);
    if (!createdMessage) {
      throw new validationError(ChatStatus.FailedToCreateMessage);
    }
    return createdMessage;
  }
}
