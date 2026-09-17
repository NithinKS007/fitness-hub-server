import { validationError } from "@presentation/middlewares/error.middleware";
import { GetUserTrainersListQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { UserMyTrainersList } from "@application/dtos/subscription-dtos";
import { UserStatus } from "@shared/constants/index.constants";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetUserTrainerslistUC } from "@application/interfaces/usecases/ISubscriptionUC";

@injectable()
export class GetUserTrainerslistUseCase implements IGetUserTrainerslistUC{
  constructor(
    @inject(TYPES_REPOSITORIES.ConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}
  
  async execute(
    { userId, page, limit, search }: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search, userId };
    const { userTrainersList, paginationData } =
      await this.conversationRepository.getUserTrainersList(query);
    if (!userTrainersList) {
      throw new validationError(UserStatus.FailedUserTrainerList);
    }
    return {
      userTrainersList: userTrainersList,
      paginationData: paginationData,
    };
  }
}
