import { CertificationsDTO, changePasswordDTO, CreateGoogleUserDTO, CreateUserDTO, FindEmailDTO,IdDTO,Role,SpecializationsDTO,trainerVerification,updateBlockStatus,UpdatePassword, UpdateUserDetails } from "../../application/dtos";
import { User } from "../entities/userEntity";

export interface UserRepository {
  createUser(data: CreateUserDTO): Promise<User>;
  findUserByEmail(data: FindEmailDTO): Promise<User | null>;
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  forgotPassword(data:UpdatePassword):Promise<User | null>
  createGoogleUser(data:CreateGoogleUserDTO):Promise<User>
  getUsers(data:Role):Promise<User[]>
  updateBlockStatus(data:updateBlockStatus):Promise<User | null>
  trainerVerification(data:trainerVerification):Promise<User | null>
  updateCertifications(data:CertificationsDTO):Promise<User | null>
  updateSpecializations(data:SpecializationsDTO):Promise<User | null>
  updateUserProfile(data:UpdateUserDetails):Promise<User | null>
  findUserById(data:IdDTO):Promise<User | null>
  changePassword(data:changePasswordDTO):Promise<User| null>
}
