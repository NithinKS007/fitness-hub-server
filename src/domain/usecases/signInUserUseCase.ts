import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import { comparePassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { SignInDTO } from "../../application/dtos";
import { generateAccessToken, generateRefreshToken } from "../../infrastructure/services/jwtService";

export class SigninUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(data:SignInDTO):Promise<{ accessToken: string; refreshToken: string; userData: User }> {
    
     const {email,password} = data
     const userData = await this.userRepository.findUserByEmail({email:email})
     if(!userData){
      throw new Error(HttpStatusMessages.EmailNotFound)
     }
     if(userData && userData.googleVerified){
      throw new Error(HttpStatusMessages.DifferentLoginMethod)
     }
     const isValidPassword = await comparePassword(password,userData.password)
     if(!userData.otpVerified){
      throw new Error(HttpStatusMessages.AccountNotVerified)
     }
     if(userData.isBlocked){
      throw new Error(HttpStatusMessages.AccountBlocked)
   }
     if(!isValidPassword){
        throw new Error(HttpStatusMessages.IncorrectPassword)
     }

     const accessToken = generateAccessToken(userData._id,userData.role)
     const refreshToken = generateRefreshToken(userData._id,userData.role)

   return {accessToken,refreshToken,userData}
  }
}
