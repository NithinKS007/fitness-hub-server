import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import { comparePassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { SignInDTO } from "../../application/dtos";

export class SigninUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(data:SignInDTO):Promise<User> {
    
     const {email,password} = data
     const userData = await this.userRepository.findUserByEmail({email:email})

     if(!userData){
        throw new Error(HttpStatusMessages.EmailNotFound)
     }
     const isValidPassword = await comparePassword(password,userData.password)

     if(!isValidPassword){
        throw new Error(HttpStatusMessages.IncorrectPassword)
     }

     if(userData.isBlocked){
        throw new Error(HttpStatusMessages.AccountBlocked)
     }
     if(!userData.otpVerified){
      throw new Error(HttpStatusMessages.InvalidOtp)
     }

     return userData
  }
}
