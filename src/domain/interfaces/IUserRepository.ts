import { FindEmailDTO, UpdatePasswordDTO } from "@application/dtos/auth-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IUser } from "@domain/entities/user.entity";

export interface IUserRepository extends IBaseRepository<IUser> {
  updateUserVerificationStatus(data: FindEmailDTO): Promise<IUser | null>;
  forgotPassword(data: UpdatePasswordDTO): Promise<IUser | null>;
  getUsers(
    data: GetUsersQueryDTO
  ): Promise<{ usersList: IUser[]; paginationData: PaginationDTO }>;
  countDocs(role: string): Promise<number>;
}
