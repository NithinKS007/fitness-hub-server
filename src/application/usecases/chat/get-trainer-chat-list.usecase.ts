import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  ChatStatus,
} from "@shared/constants/index.constants";
import { GetChatListQueryDTO } from "@application/dtos/query-dtos";
import { TrainerChatList } from "@application/dtos/chat-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class GetTrainerChatListUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}
  
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
