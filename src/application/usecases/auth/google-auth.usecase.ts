import { GoogleTokenDTO } from "../../dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "../../../presentation/middlewares/error.middleware";
import { AuthStatus } from "../../../shared/constants/index.constants";
import { User } from "../../../domain/entities/user.entities";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IAuthService } from "../../interfaces/auth/IAuth.service";
import { IGoogleAuthService } from "../../interfaces/auth/IGoogle.auth.service";

/*  
    Purpose: Handles the Google authentication process. It verifies the provided Google token, 
             checks for existing users in the system, and creates or returns user data along with 
             generated access and refresh tokens.
    Incoming: { token } (Google OAuth token provided by the client)
    Returns: { accessToken, refreshToken, userData } (Generated access and refresh tokens, and user data)
    Throws:
        - validationError if the Google user information is invalid or missing email.
        - ForbiddenError if the user's account is blocked.
        - validationError if the user attempts to log in via Google with a different login method 
          already used (OTP not verified).
*/

export class GoogleAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService,
    private googleAuthService: IGoogleAuthService
  ) {}

  private generateAccessToken(user: User): string {
    return this.authService.generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }
  private generateRefreshToken(user: User): string {
    return this.authService.generateRefreshToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }

  async execute({ token }: GoogleTokenDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: User;
  }> {
    const googleUserInfo = await this.googleAuthService.verifyToken(token);
    if (!googleUserInfo || !googleUserInfo.email) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
    const { email } = googleUserInfo;

    const userData = await this.userRepository.findOne({ email });
    if (userData && userData.isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }
    if (userData && userData.otpVerified) {
      throw new validationError(AuthStatus.DifferentLoginMethod);
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
      const userData = await this.userRepository.create(userObj);
      const accessToken = this.generateAccessToken(userData);
      const refreshToken = this.generateRefreshToken(userData);
      return {
        userData,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
    const accessToken = this.generateAccessToken(userData);
    const refreshToken = this.generateRefreshToken(userData);
    return {
      userData,
      accessToken,
      refreshToken,
    };
  }
}
