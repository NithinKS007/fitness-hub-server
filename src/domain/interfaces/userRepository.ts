import { CertificationsDTO, changePasswordDTO, CreateGoogleUserDTO, CreateUserDTO, FindEmailDTO,IdDTO,Role,SpecializationsDTO,trainerVerification,updateBlockStatus,UpdatePassword, UpdateUserDetails } from "../../application/dtos";
import { User } from "../entities/userEntity";

export interface UserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(data: FindEmailDTO): Promise<User | null>;
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  forgotPassword(data:UpdatePassword):Promise<User | null>
  createGoogleUser(data:CreateGoogleUserDTO):Promise<User>
  findById(data:IdDTO):Promise<User | null>
  changePassword(data:changePasswordDTO):Promise<User| null>
  updateUserProfile(data:UpdateUserDetails):Promise<User | null>
  getUsers():Promise<User[]>
  updateBlockStatus(data:updateBlockStatus):Promise<User | null>

}
