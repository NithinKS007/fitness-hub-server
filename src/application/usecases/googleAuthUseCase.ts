import { GoogleTokenDTO } from "../dtos/authDTOs";
import { verifyGoogleToken } from "../../infrastructure/services/googleAuthService";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../infrastructure/services/jwtService";
import {
  ForbiddenError,
  validationError,
} from "../../presentation/middlewares/errorMiddleWare";
import { AuthenticationStatusMessage } from "../../shared/constants/httpResponseStructure";
import { User } from "../../domain/entities/userEntity";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";

export class GoogleAuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  public async createGoogleUser({
    token,
  }: GoogleTokenDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: User;
  }> {
    const googleUserInfo = await verifyGoogleToken(token);
    if (!googleUserInfo || !googleUserInfo.email) {
      throw new validationError(AuthenticationStatusMessage.EmailNotFound);
    }
    const { email } = googleUserInfo;

    const userData = await this.userRepository.findByEmail({ email });
    if (userData && userData.isBlocked) {
      throw new ForbiddenError(AuthenticationStatusMessage.AccountBlocked);
    }
    if (userData && userData.otpVerified) {
      throw new validationError(AuthenticationStatusMessage.DifferentLoginMethod);
    }
    if (!userData) {
      const { email, given_name, family_name, picture } = googleUserInfo;
      const userObj = {
        email: email,
        fname: given_name,
        lname: family_name,
        profilePic: picture,
        googleVerified: true,
        otpVerified: undefined,
      };
      const userData = await this.userRepository.createGoogleUser(userObj);
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
