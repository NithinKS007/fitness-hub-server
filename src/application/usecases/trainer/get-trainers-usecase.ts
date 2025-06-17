import { GetTrainersQueryDTO } from "@application/dtos/query-dtos";
import { Trainer } from "@application/dtos/trainer-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";

export class GetTrainersUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}
  async execute({
    page,
    limit,
    search,
    filters,
  }: GetTrainersQueryDTO): Promise<{
    trainersList: Trainer[];
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
