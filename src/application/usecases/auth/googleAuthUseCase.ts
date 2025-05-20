import { GoogleTokenDTO } from "../../dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { IGoogleAuthService } from "../../interfaces/auth/IGoogleAuthService";

export class GoogleAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService,
    private googleAuthService: IGoogleAuthService
  ) {}

  public async createGoogleUser({ token }: GoogleTokenDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: User;
  }> {
    const googleUserInfo = await this.googleAuthService.verifyToken(token);
    if (!googleUserInfo || !googleUserInfo.email) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
    const { email } = googleUserInfo;

    const userData = await this.userRepository.findByEmail({ email });
    if (userData && userData.isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }
    if (userData && userData.otpVerified) {
      throw new validationError(
        AuthStatus.DifferentLoginMethod
      );
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
        accessToken: this.authService.generateAccessToken({
          _id: userData._id.toString(),
          role: userData.role,
        }),
        refreshToken: this.authService.generateRefreshToken({
          _id: userData._id.toString(),
          role: userData.role,
        }),
      };
    }
    const accessToken = this.authService.generateAccessToken({
      _id: userData._id.toString(),
      role: userData.role,
    });
    const refreshToken = this.authService.generateRefreshToken({
      _id: userData._id.toString(),
      role: userData.role,
    });
    return {
      userData,
      accessToken,
      refreshToken,
    };
  }
}
