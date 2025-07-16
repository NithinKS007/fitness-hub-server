import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { UserStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { User } from "@domain/entities/user.entity";
import { IGetUsersUC } from "@application/interfaces/usecases/IUserUC";

@injectable()
export class GetUsersUseCase implements IGetUsersUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  
  async execute({ page, limit, search, filters }: GetUsersQueryDTO): Promise<{
    usersList: User[];
    paginationData: PaginationDTO;
  }> {
    const query = { page, limit, search, filters };
    const { usersList, paginationData } = await this.userRepository.getUsers(
      query
    );
    if (!usersList) {
      throw new validationError(UserStatus.FailedToRetrieveUsersList);
    }
    return { usersList, paginationData };
  }
}
