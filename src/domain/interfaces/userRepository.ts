import { CreateUserDTO, FindEmailDTO} from "../../application/dtos";
import { User } from "../entities/userEntity";

export interface UserRepository {
  createUser(data: CreateUserDTO): Promise<User>;
  findUserByEmail(data: FindEmailDTO): Promise<User | null>;
}
