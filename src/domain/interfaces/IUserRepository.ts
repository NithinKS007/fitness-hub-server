import { FindEmailDTO, UpdatePasswordDTO } from "@application/dtos/auth-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { User } from "@domain/entities/user.entity";
import { IUser } from "@infrastructure/databases/models/user.model";

export interface IUserRepository extends IBaseRepository<IUser,User> {
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  forgotPassword(data: UpdatePasswordDTO): Promise<User | null>;
  getUsers(
    data: GetUsersQueryDTO
  ): Promise<{ usersList: User[]; paginationData: PaginationDTO }>;
  countDocs(role: string): Promise<number>;
}
