import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/user.entities";
import { PaginationDTO } from "../../dtos/utility-dtos";
import {
  ApplicationStatus,
  AuthStatus,
  BlockStatus,
  ProfileStatus,
  UserStatus,
} from "../../../shared/constants/index.constants";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { UpdateBlockStatusDTO } from "../../dtos/auth-dtos";
import { GetUsersQueryDTO } from "../../dtos/query-dtos";

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async getUsers({ page, limit, search, filters }: GetUsersQueryDTO): Promise<{
    usersList: User[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search, filters };
    const { usersList, paginationData } = await this.userRepository.getUsers(
      query
    );
    if (!usersList) {
      throw new validationError(UserStatus.failedToRetrieveUsersList);
    }
    return { usersList, paginationData };
  }

  async getUserDetails(userId: string): Promise<User | null> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(ProfileStatus.FailedToRetrieveUserDetails);
    }
    return userData;
  }

  async updateBlockStatus({
    userId,
    isBlocked,
  }: UpdateBlockStatusDTO): Promise<User | null> {
    if (!userId || typeof isBlocked !== "boolean") {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const userData = await this.userRepository.updateBlockStatus({
      userId,
      isBlocked,
    });
    if (!userData) {
      throw new validationError(BlockStatus.FailedToUpdateBlockStatus);
    }
    return userData;
  }
}
