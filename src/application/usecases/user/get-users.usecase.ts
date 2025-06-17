import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { UserStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { IUser } from "@domain/entities/user.entity";

export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ page, limit, search, filters }: GetUsersQueryDTO): Promise<{
    usersList: IUser[];
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
}
