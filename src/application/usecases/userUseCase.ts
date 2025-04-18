import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User } from "../../domain/entities/userEntity";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { AuthenticationStatusMessage, BlockStatusMessage, ProfileStatusMessage, UserStatusMessage } from "../../shared/constants/httpResponseStructure";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { UpdateBlockStatusDTO } from "../dtos/authDTOs";
import { GetUsersQueryDTO } from "../dtos/queryDTOs";

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
      throw new validationError(UserStatusMessage.failedToRetrieveUsersList);
    }

    
    
    return { usersList, paginationData };
  }

  public async getUserDetails(userId: IdDTO): Promise<User | null> {
    if (!userId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(ProfileStatusMessage.FailedToRetrieveUserDetails);
    }
    return userData;
  }

  public async updateBlockStatus({
    userId,
    isBlocked,
  }: UpdateBlockStatusDTO): Promise<User | null> {
    if (!userId || !isBlocked) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }
    const userData = await this.userRepository.updateBlockStatus({
      userId,
      isBlocked,
    });
    if (!userData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }
    return userData;
  }
}
