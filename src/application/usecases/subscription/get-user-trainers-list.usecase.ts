import { validationError } from "@presentation/middlewares/error.middleware";
import { GetUserTrainersListQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IConversationRepository } from "@domain/interfaces/IConversationRepository";
import { UserMyTrainersList } from "@application/dtos/subscription-dtos";
import { UserStatus } from "@shared/constants/index.constants";

export class GetUserTrainerslistUseCase {
  constructor(private conversationRepository: IConversationRepository) {}
  async execute(
    userId: string,
    { page, limit, search }: GetUserTrainersListQueryDTO
  ): Promise<{
    userTrainersList: UserMyTrainersList[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search };
    const { userTrainersList, paginationData } =
      await this.conversationRepository.getUserTrainersList(userId, query);
    if (!userTrainersList) {
      throw new validationError(UserStatus.FailedUserTrainerList);
    }
    return {
      userTrainersList: userTrainersList,
      paginationData: paginationData,
    };
  }
}
