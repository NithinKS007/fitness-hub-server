import { IChatRepository } from "@domain/interfaces/IChatRepository";
import {
  InternalServerError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { ApplicationStatus, ChatStatus } from "@shared/constants/index.constants";
import { GetUserChatListDTO } from "@application/dtos/query-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetUserChatListUC } from "@application/interfaces/usecases/IChatUC";
import { URChatListUILayer } from "@infrastructure/mappers/chat.mapper";

@injectable()
export class GetUserChatListUseCase implements IGetUserChatListUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}

  async execute({
    userId,
    search,
  }: GetUserChatListDTO): Promise<URChatListUILayer[]> {
    if (!userId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const usersChatList = await this.chatRepository.findUserChatList({
      userId,
      search,
    });
    if (!usersChatList) {
      throw new InternalServerError(ChatStatus.FailedToRetrieveChatList);
    }
    return usersChatList;
  }
}
