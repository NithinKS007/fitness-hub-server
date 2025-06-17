import { GetTrainersApprovalQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { TrainerStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { Trainer } from "@application/dtos/trainer-dtos";

export class GetVerifyTrainerlistUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}
  async execute({
    page,
    limit,
    fromDate,
    toDate,
    search,
  }: GetTrainersApprovalQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, fromDate, toDate, search };
    const { trainersList, paginationData } =
      await this.trainerRepository.getVerifyPendingList(query);
    if (!trainersList) {
      throw new validationError(TrainerStatus.FailedToRetrieveTrainersList);
    }
    return {
      trainersList,
      paginationData,
    };
  }
}
