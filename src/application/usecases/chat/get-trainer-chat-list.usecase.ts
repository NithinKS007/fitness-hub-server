import { TrainerChatList } from "../../../domain/entities/conversation.entities";
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
import { IConversationRepository } from "../../../domain/interfaces/IConversationRepository";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  ChatStatus,
} from "../../../shared/constants/index.constants";
import { GetChatListQueryDTO } from "../../dtos/query-dtos";

export class GetTrainerChatListUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
  async execute(
    trainerId: string,
    { search }: GetChatListQueryDTO
  ): Promise<TrainerChatList[]> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const trainerChatList =
      await this.conversationRepository.findTrainerChatList(trainerId, {
        search,
      });
    if (!trainerChatList) {
      throw new validationError(ChatStatus.FailedToRetrieveChatList);
    }
    return trainerChatList;
  }
}
