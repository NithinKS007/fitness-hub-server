import { changePasswordDTO,FindEmailDTO,UpdatePasswordDTO } from "../../application/dtos/authDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { CreateGoogleUserDTO,UpdateUserDetailsDTO,CreateUserDTO } from "../../application/dtos/userDTOs";
import { UpdateBlockStatusDTO } from "../../application/dtos/authDTOs";
import { User } from "../entities/userEntity";
import { GetUsersQueryDTO } from "../../application/dtos/queryDTOs";

export interface UserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(data: FindEmailDTO): Promise<User | null>;
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  forgotPassword(data:UpdatePasswordDTO):Promise<User | null>
  createGoogleUser(data:CreateGoogleUserDTO):Promise<User>
  findById(data:IdDTO):Promise<User | null>
  changePassword(data:changePasswordDTO):Promise<User| null>
  updateUserProfile(data:UpdateUserDetailsDTO):Promise<User | null>
  getUsers(data:GetUsersQueryDTO):Promise<{usersList :User[],paginationData:PaginationDTO}>
  updateBlockStatus(data:UpdateBlockStatusDTO):Promise<User | null>
  countDocs(role:string):Promise<number>
}
