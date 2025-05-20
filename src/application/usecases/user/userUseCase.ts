import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/user";
import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";
import { AuthStatus, BlockStatus, ProfileStatus, UserStatus } from "../../../shared/constants/index-constants";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { UpdateBlockStatusDTO } from "../../dtos/auth-dtos";
import { GetUsersQueryDTO } from "../../dtos/query-dtos";

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  public async getUsers({
    page,
    limit,
    search,
    filters,
  }: GetUsersQueryDTO): Promise<{
    usersList: User[];
    paginationData: PaginationDTO;
  }> {
    const { usersList, paginationData } = await this.userRepository.getUsers({
      page,
      limit,
      search,
      filters,
    });
    if (!usersList) {
      throw new validationError(UserStatus.failedToRetrieveUsersList);
    }

    return { usersList, paginationData };
  }

  public async getUserDetails(userId: IdDTO): Promise<User | null> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(ProfileStatus.FailedToRetrieveUserDetails);
    }
    return userData;
  }

  public async updateBlockStatus({
    userId,
    isBlocked,
  }: UpdateBlockStatusDTO): Promise<User | null> {
    if (!userId ||typeof isBlocked !== "boolean") {
      throw new validationError(AuthStatus.AllFieldsAreRequired);
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
