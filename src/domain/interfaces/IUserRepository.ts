import {
  FindEmailDTO,
  UpdatePasswordDTO,
} from "../../application/dtos/auth-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  UpdateUserDetailsDTO,
} from "../../application/dtos/user-dtos";
import { User } from "../entities/user.entities";
import { GetUsersQueryDTO } from "../../application/dtos/query-dtos";
import { IUser } from "../../infrastructure/databases/models/user.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser>{
  // findByEmail(data: FindEmailDTO): Promise<User | null>;
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  forgotPassword(data: UpdatePasswordDTO): Promise<User | null>;
  // updateUserProfile(data: UpdateUserDetailsDTO): Promise<User | null>;
  getUsers(
    data: GetUsersQueryDTO
  ): Promise<{ usersList: User[]; paginationData: PaginationDTO }>;
  countDocs(role: string): Promise<number>;
}
