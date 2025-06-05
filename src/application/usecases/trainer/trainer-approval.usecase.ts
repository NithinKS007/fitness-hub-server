import { TrainerVerificationDTO } from "../../dtos/trainer-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { ITrainer } from "../../../infrastructure/databases/models/trainer.model";
import { Action } from "../../dtos/utility-dtos";

export class TrainerApprovalUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}
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
