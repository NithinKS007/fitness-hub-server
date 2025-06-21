import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {
  ApplicationStatus,
  BlockStatus,
} from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { UpdateBlockStatusDTO } from "@application/dtos/auth-dtos";
import { IUser } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class UpdateUserBlockStatusUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  
  async execute({
    userId,
    isBlocked,
  }: UpdateBlockStatusDTO): Promise<IUser | null> {
    if (!userId || typeof isBlocked !== "boolean") {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const userData = await this.userRepository.update(userId, {
      isBlocked: isBlocked,
    });
    if (!userData) {
      throw new validationError(BlockStatus.StatusUpdateFailed);
    }
    return userData;
  }
}
