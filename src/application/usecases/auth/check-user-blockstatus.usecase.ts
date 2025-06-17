import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";

/*  
    Purpose: Check if a user or trainer is blocked based on their ID
    Incoming: { _id } (User or Trainer ID to check their block status)
    Returns: { boolean } (Returns true if the user/trainer is blocked, false otherwise)
    Throws: 
        - Validation error if ID is missing or invalid
        - Throws an error if no user or trainer is found for the given ID
*/

export class CheckUserBlockStatusUseCase {
  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository
  ) {}

  async execute(_id: string): Promise<boolean> {
    if (!_id) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const [userData, trainerData] = await Promise.all([
      this.userRepository.findById(_id),
      this.trainerRepository.getTrainerDetailsById(_id.toString()),
    ]);

    if (!userData && !trainerData) {
      throw new validationError(AuthStatus.InvalidId);
    }

    if (userData) return userData.isBlocked;
    if (trainerData) return trainerData.isBlocked;
    return false;
  }
}
