import {
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICheckUserBlockStatusUC } from "@application/interfaces/usecases/IAuthUC";

/*  
    Purpose: Check if a user or trainer is blocked based on their ID
    Incoming: { _id } (User or Trainer ID to check their block status)
    Returns: { boolean } (Returns true if the user/trainer is blocked, false otherwise)
    Throws: 
        - Validation error if ID is missing or invalid
        - Throws an error if no user or trainer is found for the given ID
*/

@injectable()
export class CheckUserBlockStatusUseCase implements ICheckUserBlockStatusUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    if (!id) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const userData = await this.userRepository.findById(id);

    if (!userData) {
      throw new NotFoundError(AuthStatus.InvalidId);
    }

    if (userData) return userData.isBlocked;
    return false;
  }
}
