import { IChatRepository } from "@domain/interfaces/IChatRepository";
import {
  InternalServerError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { ApplicationStatus, ChatStatus } from "@shared/constants/index.constants";
import { GetTrainerChatListDTO } from "@application/dtos/query-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetTrainerChatListUC } from "@application/interfaces/usecases/IChatUC";
import { TRChatListUILayer } from "@infrastructure/mappers/chat.mapper";

@injectable()
export class GetTrainerChatListUseCase implements IGetTrainerChatListUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}

  async execute({
    trainerId,
    search,
  }: GetTrainerChatListDTO): Promise<TRChatListUILayer[]> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const trainerChatList = await this.chatRepository.findTrainerChatList({
      trainerId,
      search,
    });
    if (!trainerChatList) {
      throw new InternalServerError(ChatStatus.FailedToRetrieveChatList);
    }
    return trainerChatList;
  }
}
