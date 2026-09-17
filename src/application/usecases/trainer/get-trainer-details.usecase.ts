import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus, TrainerStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { TrainerDTO } from "@application/dtos/trainer-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetTrainerDetailsUC } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class GetTrainerDetailsUseCase implements IGetTrainerDetailsUC {
  constructor(
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository
  ) {}

  async execute(trainerId: string): Promise<TrainerDTO> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const trainerDetails = await this.trainerRepository.getTrainerDetailsById(
      trainerId
    );
    if (!trainerDetails) {
      throw new validationError(TrainerStatus.FailedToRetrieveTrainerDetails);
    }
    return trainerDetails;
  }
}
