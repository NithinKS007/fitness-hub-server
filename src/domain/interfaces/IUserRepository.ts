import {
  ChangePasswordDTO,
  FindEmailDTO,
  UpdatePasswordDTO,
} from "../../application/dtos/auth-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  CreateGoogleUserDTO,
  UpdateUserDetailsDTO,
  CreateUserDTO,
} from "../../application/dtos/user-dtos";
import { UpdateBlockStatusDTO } from "../../application/dtos/auth-dtos";
import { User } from "../entities/user.entities";
import { GetUsersQueryDTO } from "../../application/dtos/query-dtos";
import { IUser } from "../../infrastructure/databases/models/user.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser>{
  // create(data: CreateUserDTO): Promise<User>;
  findByEmail(data: FindEmailDTO): Promise<User | null>;
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  forgotPassword(data: UpdatePasswordDTO): Promise<User | null>;
  createGoogleUser(data: CreateGoogleUserDTO): Promise<User>;
  // findById(data: string): Promise<User | null>;
  changePassword(data: ChangePasswordDTO): Promise<User | null>;
  updateUserProfile(data: UpdateUserDetailsDTO): Promise<User | null>;
  getUsers(
    data: GetUsersQueryDTO
  ): Promise<{ usersList: User[]; paginationData: PaginationDTO }>;
  updateBlockStatus(data: UpdateBlockStatusDTO): Promise<User | null>;
  countDocs(role: string): Promise<number>;
}
