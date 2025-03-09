import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import { comparePassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { SignInDTO } from "../../application/dtos";
import { generateAccessToken, generateRefreshToken } from "../../infrastructure/services/jwtService";
import { ForbiddenError, validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { TrainerRepository } from "../interfaces/trainerRepository";
import { Trainer } from "../entities/trainerEntity";

export class SigninUserUseCase {
  constructor(private userRepository: UserRepository ,private trainerRepository:TrainerRepository) {}

  public async signIn(data:SignInDTO):Promise<{ accessToken: string; refreshToken: string; userData: User | Trainer }> {
    
     const {email,password} = data
     const userData = await this.userRepository.findByEmail({email:email})
     if(!userData){
      throw new validationError(HttpStatusMessages.EmailNotFound)
     }
     if(userData && userData.googleVerified){
      throw new validationError(HttpStatusMessages.DifferentLoginMethod)
     }
     if(!userData.otpVerified){
      throw new ForbiddenError(HttpStatusMessages.AccountNotVerified)
     }
     if(userData.isBlocked){
      throw new ForbiddenError(HttpStatusMessages.AccountBlocked)
     }
     const isValidPassword = await comparePassword(password,userData.password)
     if(!isValidPassword){
        throw new validationError(HttpStatusMessages.IncorrectPassword)
     }
     if(userData.role==="trainer"){
       const trainerData = await this.trainerRepository.getTrainerDetailsByUserIdRef(userData._id)
       if(!trainerData){
        console.log("triggering here")
        throw new validationError(HttpStatusMessages.FailedToRetrieveTrainerDetails)
       }
       const accessToken = generateAccessToken(trainerData._id,trainerData.role)
       const refreshToken = generateRefreshToken(trainerData._id,trainerData.role)


       console.log("trainer data sending to the front end after logging in",trainerData)

       return {accessToken,refreshToken,userData:trainerData}
     } else {
      const accessToken = generateAccessToken(userData._id,userData.role)
      const refreshToken = generateRefreshToken(userData._id,userData.role)
      return {accessToken,refreshToken,userData}
     }

  }
}
