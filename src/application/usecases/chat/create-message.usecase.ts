import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { InternalServerError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { CreateChatDTO } from "@application/dtos/chat-dtos";
import { Chat } from "@domain/entities/chat.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICreateMessageUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class CreateMessageUseCase implements ICreateMessageUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}

  async execute(createChat: CreateChatDTO): Promise<Chat> {
    const createdMessage = await this.chatRepository.create(createChat);
    if (!createdMessage) {
      throw new InternalServerError(ChatStatus.FailedToCreateMessage);
    }
    return createdMessage;
  }
}
