import { googleTokenDTO } from "../../application/dtos";
import { verifyGoogleToken } from "../../infrastructure/services/googleAuthService";
import { generateAccessToken, generateRefreshToken } from "../../infrastructure/services/jwtService";
import { ForbiddenError, validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { User } from "../entities/userEntity";
import { UserRepository } from "../interfaces/userRepository";

export class GoogleAuthUseCase {
  constructor(private userRepository: UserRepository) {}

  public async createGoogleUser(data: googleTokenDTO): Promise<{ accessToken: string; refreshToken: string; userData: User }> {
    const { token } = data;
    const googleUserInfo = await verifyGoogleToken(token)
    if (!googleUserInfo || !googleUserInfo.email) {
      throw new validationError(HttpStatusMessages.EmailNotFound);
    }
    const { email} = googleUserInfo;
    
    const userData = await this.userRepository.findByEmail({email})
    if(userData&&userData.isBlocked){
      throw new ForbiddenError(HttpStatusMessages.AccountBlocked)
    }
    if(userData&&userData.otpVerified){
      throw new validationError(HttpStatusMessages.DifferentLoginMethod)
    }
    if(!userData){
      const {email,given_name,family_name,picture} = googleUserInfo
      const userObj = {email:email,fname:given_name,lname:family_name,profilePic:picture,googleVerified:true,otpVerified:undefined}
      const userData = await this.userRepository.createGoogleUser(userObj)
      return {
         userData,
        accessToken: generateAccessToken(userData._id.toString(), email),
        refreshToken: generateRefreshToken(userData._id.toString(), email),
      };
    }
    const accessToken = generateAccessToken(userData._id.toString(), email);
    const refreshToken = generateRefreshToken(userData._id.toString(), email);
    return {
       userData,
      accessToken,
      refreshToken,
    };
  }
}
