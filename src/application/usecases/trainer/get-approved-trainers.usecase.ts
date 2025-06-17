import { GetApprovedTrainerQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { TrainerStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { Trainer } from "@application/dtos/trainer-dtos";

export class GetApprovedTrainersUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}
  async execute({
    page,
    limit,
    search,
    sort,
    experience,
    gender,
    specialization,
  }: GetApprovedTrainerQueryDTO): Promise<{
    trainersList: Trainer[];
    paginationData: PaginationDTO;
  }> {
    const query = {
      page,
      limit,
      search,
      sort,
      experience,
      gender,
      specialization,
    };
    const { trainersList, paginationData } =
      await this.trainerRepository.getApprovedTrainers(query);
    if (!trainersList) {
      throw new validationError(TrainerStatus.FailedToRetrieveTrainersList);
    }
    return {
      trainersList,
      paginationData,
    };
  }
}
