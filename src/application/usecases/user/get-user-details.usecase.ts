import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {
  AuthStatus,
  ProfileStatus,
  TrainerStatus,
} from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { User } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetUserDetailsUC } from "@application/interfaces/usecases/IUserUC";
import { ITrainerRepository } from "@di/file-imports-index";
import { Trainer } from "@domain/entities/trainer.entity";

@injectable()
export class GetUserDetailsUseCase implements IGetUserDetailsUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository
  ) {}

  async execute(
    userId: string
  ): Promise<User | (User & { trainerDetails: Trainer })> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(ProfileStatus.RetrieveFail);
    }

    if (userData.role === "trainer") {
      const trainerDetails = await this.trainerRepository.findOne({
        userId: userData?.id,
      });

      if (!trainerDetails) {
        throw new validationError(TrainerStatus.FailedToFetchDetails);
      }
      return {
        ...userData,
        trainerDetails: {
          ...trainerDetails,
        },
      };
    }

    return userData;
  }
}
