import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { AuthStatus, ProfileStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IUser } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

@injectable()
export class GetUserDetailsUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  
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
