import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus, TrainerStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { Trainer } from "@application/dtos/trainer-dtos";

export class GetTrainerDetailsUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}
  async execute(trainerId: string): Promise<Trainer> {
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
