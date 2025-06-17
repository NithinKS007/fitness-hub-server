import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { CreateChatDTO } from "@application/dtos/chat-dtos";
import { IChat } from "@domain/entities/chat.entity";

export class CreateMessageUseCase {
  constructor(private chatRepository: IChatRepository) {}
  async execute(createChat: CreateChatDTO): Promise<IChat> {
    const createdMessage = await this.chatRepository.create(createChat);
    if (!createdMessage) {
      throw new validationError(ChatStatus.FailedToCreateMessage);
    }
    return createdMessage;
  }
}
