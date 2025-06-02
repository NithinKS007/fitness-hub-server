import { TrainerVerificationDTO } from "../../dtos/trainer-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import { Trainer } from "../../../domain/entities/trainer.entities";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";

export class TrainerApprovalUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}
  async handleVerification({
    trainerId,
    action,
  }: TrainerVerificationDTO): Promise<Trainer | null> {
    if (!trainerId || !action) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    return await this.trainerRepository.handleVerification({
      trainerId,
      action,
    });
  }
}
