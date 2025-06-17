import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {
  ApplicationStatus,
  BlockStatus,
} from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { UpdateBlockStatusDTO } from "@application/dtos/auth-dtos";
import { IUser } from "@domain/entities/user.entity";

export class UpdateUserBlockStatusUseCase {
  constructor(private userRepository: IUserRepository) {}
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
