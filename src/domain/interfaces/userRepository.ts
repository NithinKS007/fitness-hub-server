import { CreateGoogleUserDTO, CreateUserDTO, FindEmailDTO,Role,trainerVerification,updateBlockStatus,UpdatePassword } from "../../application/dtos";
import { User } from "../entities/userEntity";

export interface UserRepository {
  createUser(data: CreateUserDTO): Promise<User>;
  findUserByEmail(data: FindEmailDTO): Promise<User | null>;
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  resetPassword(data:UpdatePassword):Promise<User | null>
  createGoogleUser(data:CreateGoogleUserDTO):Promise<User | null>
  getUsers(data:Role):Promise<User[]>
  updateBlockStatus(data:updateBlockStatus):Promise<User | null>
  // getTrainersApprovalRejectionList():Promise<User[]>
  trainerVerification(data:trainerVerification):Promise<User | null>
}
