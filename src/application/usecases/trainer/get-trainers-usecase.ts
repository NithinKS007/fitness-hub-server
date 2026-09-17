import { GetTrainersDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { injectable, inject } from "inversify";
import { IGetTrainersUC } from "@application/interfaces/usecases/ITrainerUC";
import { IUserRepository } from "@di/file-imports-index";
import { User } from "@domain/entities/user.entity";
import { Trainer } from "@domain/entities/trainer.entity";

@injectable()
export class GetTrainersUseCase implements IGetTrainersUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(dtos: GetTrainersDTO): Promise<{
    trainersList: (Omit<User, "password" | "createdAt" | "updatedAt"> & {
      trainerDetails: Omit<Trainer, "createdAt" | "updatedAt">;
    })[];
    paginationData: PaginationDTO;
  }> {
    const { data: trainersList, pagination: paginationData } =
      await this.userRepository.getTrainers(dtos);
    return {
      trainersList,
      paginationData,
    };
  }
}
