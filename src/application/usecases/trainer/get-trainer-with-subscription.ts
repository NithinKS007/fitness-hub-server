import { validationError } from "@presentation/middlewares/error.middleware";
import { TrainerStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { TrainerWithSubscription } from "@application/dtos/trainer-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class GetTrainerAndSubInfoUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository
  ) {}
  
  async execute(trainerId: string): Promise<TrainerWithSubscription> {
    const trainerData = await this.trainerRepository.getTrainerWithSub(
      trainerId
    );
    if (!trainerData) {
      throw new validationError(
        TrainerStatus.FailedToRetrieveTrainerWithSubscription
      );
    }
    return trainerData;
  }
}
