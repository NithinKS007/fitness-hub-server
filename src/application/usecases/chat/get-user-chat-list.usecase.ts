import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  ChatStatus,
} from "@shared/constants/index.constants";
import { GetUserChatListDTO } from "@application/dtos/query-dtos";
import { UserChatList } from "@application/dtos/chat-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetUserChatListUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class GetUserChatListUseCase implements IGetUserChatListUC{
  constructor(
    @inject(TYPES_REPOSITORIES.ConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}

  async execute({
    userId,
    search,
  }: GetUserChatListDTO): Promise<UserChatList[]> {
    if (!userId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const usersChatList = await this.conversationRepository.findUserChatList({
      userId,
      search,
    });
    if (!usersChatList) {
      throw new validationError(ChatStatus.FailedToRetrieveChatList);
    }
    return usersChatList;
  }
}
