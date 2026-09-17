import { validationError } from "@presentation/middlewares/error.middleware";
import { GetUserTrainersListDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IChatRepository } from "@domain/interfaces/IChatRepository";
import { UserStatus } from "@shared/constants/index.constants";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetUserTrainerslistUC } from "@application/interfaces/usecases/ISubscriptionUC";
import { UserMyTRListUILayer } from "@infrastructure/mappers/chat.mapper";

@injectable()
export class GetUserTrainerslistUseCase implements IGetUserTrainerslistUC {
  constructor(
    @inject(TYPES_REPOSITORIES.ChatRepository)
    private chatRepository: IChatRepository
  ) {}

  async execute({ userId, page, limit, search }: GetUserTrainersListDTO): Promise<{
    userTrainersList: UserMyTRListUILayer[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search, userId };
    const { data: userTrainersList, pagination: paginationData } =
      await this.chatRepository.getUserTrainersList(query);
    if (!userTrainersList) {
      throw new validationError(UserStatus.FailedUserTrainerList);
    }
    return {
      userTrainersList: userTrainersList,
      paginationData: paginationData,
    };
  }
}
