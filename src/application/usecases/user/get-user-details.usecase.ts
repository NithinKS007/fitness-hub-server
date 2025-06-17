import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { AuthStatus, ProfileStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IUser } from "@domain/entities/user.entity";

export class GetUserDetailsUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string): Promise<IUser | null> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(ProfileStatus.RetrieveFail);
    }
    return userData;
  }
}
