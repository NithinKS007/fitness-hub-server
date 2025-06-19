import { TrainerVerificationDTO } from "@application/dtos/trainer-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { Action } from "@application/dtos/utility-dtos";
import { ITrainer } from "@domain/entities/trainer.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

@injectable()
export class TrainerApprovalUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository
  ) {}
  
  async execute({
    trainerId,
    action,
  }: TrainerVerificationDTO): Promise<ITrainer | null> {
    if (!trainerId || !action) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    if (action === Action.Approved) {
      return await this.trainerRepository.update(trainerId, {
        isApproved: true,
      });
    } else {
      return await this.trainerRepository.delete(trainerId);
    }
  }
}
