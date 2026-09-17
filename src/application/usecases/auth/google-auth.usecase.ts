import { GoogleTokenDTO } from "@application/dtos/auth-dtos";
import {
  ConflictError,
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IAuthService } from "@application/interfaces/services/auth/IAuth.service";
import { IGoogleAuthService } from "@application/interfaces/services/auth/IGoogle.auth.service";
import { User } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IGoogleAuthUC } from "@application/interfaces/usecases/IAuthUC";

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

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_SERVICES.AuthService) private authService: IAuthService,
    @inject(TYPES_SERVICES.GoogleAuthService)
    private googleAuthService: IGoogleAuthService
  ) {}

  private generateAccessToken(user: User): string {
    return this.authService.createAccessToken({
      _id: user._id,
      role: user.role,
    });
  }
  private generateRefreshToken(user: User): string {
    return this.authService.createRefreshToken({
      _id: user._id,
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

    let userData = await this.userRepository.findOne({ email });
    if (userData && userData.isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }
    if (userData && userData.otpVerified) {
      throw new ConflictError(AuthStatus.DifferentLoginMethod);
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
      userData = await this.userRepository.create(userObj);
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
