import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import {
  InternalServerError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  ChatStatus,
} from "@shared/constants/index.constants";
import { GetTrainerChatListDTO } from "@application/dtos/query-dtos";
import { TrainerChatList } from "@application/dtos/chat-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetTrainerChatListUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class GetTrainerChatListUseCase implements IGetTrainerChatListUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}

  async execute({
    trainerId,
    search,
  }: GetTrainerChatListDTO): Promise<TrainerChatList[]> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const trainerChatList =
      await this.conversationRepository.findTrainerChatList({
        trainerId,
        search,
      });
    if (!trainerChatList) {
      throw new InternalServerError(ChatStatus.FailedToRetrieveChatList);
    }
    return trainerChatList;
  }
}
