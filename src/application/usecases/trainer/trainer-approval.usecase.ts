import { TrainerVerificationDTO } from "@application/dtos/trainer-dtos";
import {
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { Action } from "@application/dtos/utility-dtos";
import { Trainer } from "@domain/entities/trainer.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ITrainerApprovalUC } from "@application/interfaces/usecases/ITrainerUC";
import { IUserRepository } from "@di/file-imports-index";
import { User } from "@domain/entities/user.entity";

@injectable()
export class TrainerApprovalUseCase implements ITrainerApprovalUC {
  constructor(
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository,
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute({
    trainerId,
    action,
  }: TrainerVerificationDTO): Promise<
    Omit<User, "password"> & { trainerDetails: Trainer }
  > {
    if (!trainerId || !action) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const trainerData = await this.trainerRepository.findById(trainerId);

    if (!trainerData) {
      throw new NotFoundError("trainer not found");
    }

    const userData = await this.userRepository.findById(trainerData?.userId);

    if (!userData) {
      throw new NotFoundError("user not found");
    }

    const { password, ...excludedPassword } = userData;

    if (action === Action.Approved) {
      await this.trainerRepository.update(trainerId, {
        isApproved: true,
      });
    } else {
      await Promise.all([
        this.userRepository.delete(trainerData.userId),
        this.trainerRepository.delete(trainerId),
      ]);
    }

    return { ...excludedPassword, trainerDetails: { ...trainerData } };
  }
}
