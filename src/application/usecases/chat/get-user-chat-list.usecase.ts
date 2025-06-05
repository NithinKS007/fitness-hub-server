import { UserChatList } from "../../../domain/entities/conversation.entities";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  ChatStatus,
} from "../../../shared/constants/index.constants";
import { GetChatListQueryDTO } from "../../dtos/query-dtos";

export class GetUserChatListUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
  async execute(
    userId: string,
    { search }: GetChatListQueryDTO
  ): Promise<UserChatList[]> {
    if (!userId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const usersChatList = await this.conversationRepository.findUserChatList(
      userId,
      {
        search,
      }
    );
    if (!usersChatList) {
      throw new validationError(ChatStatus.FailedToRetrieveChatList);
    }
    return usersChatList;
  }
}
