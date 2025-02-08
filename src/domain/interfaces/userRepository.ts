import { CreateGoogleUserDTO, CreateUserDTO, FindEmailDTO,UpdatePassword } from "../../application/dtos";
import { User } from "../entities/userEntity";

export interface UserRepository {
  createUser(data: CreateUserDTO): Promise<User>;
  findUserByEmail(data: FindEmailDTO): Promise<User | null>;
  updateUserVerificationStatus(data: FindEmailDTO): Promise<User | null>;
  resetPassword(data:UpdatePassword):Promise<User | null>
  createGoogleUser(data:CreateGoogleUserDTO):Promise<User | null>
}
