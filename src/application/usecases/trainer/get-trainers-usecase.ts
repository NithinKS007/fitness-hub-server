import { GetTrainersQueryDTO } from "@application/dtos/query-dtos";
import { TrainerDTO } from "@application/dtos/trainer-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { injectable, inject } from "inversify";
import { IGetTrainersUC } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class GetTrainersUseCase implements IGetTrainersUC {
  constructor(
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository
  ) {}
  
  async execute({ page, limit, search, filters,
  }: GetTrainersQueryDTO): Promise<{
    trainersList: TrainerDTO[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search, filters };
    const { trainersList, paginationData } =
      await this.trainerRepository.getTrainers(query);
    return {
      trainersList,
      paginationData,
    };
  }
}
