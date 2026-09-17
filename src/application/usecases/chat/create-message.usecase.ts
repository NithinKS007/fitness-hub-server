import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { InternalServerError } from "@presentation/middlewares/error.middleware";
import { ChatStatus } from "@shared/constants/index.constants";
import { CreateChatDTO } from "@application/dtos/chat-dtos";
import { Message } from "@domain/entities/message.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICreateMessageUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class CreateMessageUseCase implements ICreateMessageUC {
  constructor(
    @inject(TYPES_REPOSITORIES.MessageRepository)
    private chatRepository: IMessageRepository
  ) {}

  async execute(createChat: CreateChatDTO): Promise<Message> {
    const createdMessage = await this.chatRepository.create(createChat);
    if (!createdMessage) {
      throw new InternalServerError(ChatStatus.FailedToCreateMessage);
    }
    return createdMessage;
  }
}
