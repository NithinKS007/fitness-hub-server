import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {
  AuthStatus,
  PasswordStatus,
  TrainerStatus,
} from "@shared/constants/index.constants";
import { SignInDTO } from "@application/dtos/auth-dtos";
import {
  ForbiddenError,
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { IAuthService } from "@application/interfaces/services/auth/IAuth.service";
import { IEncryptionService } from "@application/interfaces/services/security/IEncryption.service";
import { User } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { ISigninUserUC } from "@application/interfaces/usecases/IAuthUC";
import { Trainer } from "@domain/entities/trainer.entity";

/**
 * Purpose: Handle the sign-in process for a user or trainer.
 * Incoming: { email, password } - User credentials for authentication.
 * Returns: { accessToken, refreshToken, userData } - JWT tokens and user data.
 * Throws: Error if user data is invalid, OTP not verified, or password is incorrect.
 */

@injectable()
export class SigninUserUseCase implements ISigninUserUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository,
    @inject(TYPES_SERVICES.AuthService)
    private authService: IAuthService,
    @inject(TYPES_SERVICES.EncryptionService)
    private encryptionService: IEncryptionService
  ) {}

  private async generateAccessToken(user: User): Promise<string> {
    return this.authService.createAccessToken({
      id: user.id,
      role: user.role,
    });
  }
  private async generateRefreshToken(user: User): Promise<string> {
    return this.authService.createRefreshToken({
      id: user.id,
      role: user.role,
    });
  }

  private async validateUserLogin(
    email: string,
    password: string
  ): Promise<User> {
    const userData = await this.userRepository.findOne({ email: email });
    if (!userData) {
      throw new NotFoundError(AuthStatus.EmailNotFound);
    }
    if (userData && userData?.googleVerified) {
      throw new validationError(AuthStatus.DifferentLoginMethod);
    }
    if (!userData?.otpVerified) {
      throw new ForbiddenError(AuthStatus.AccountNotVerified);
    }
    if (userData?.isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }
    const isValidPassword = await this.encryptionService.compare(
      password,
      userData?.password
    );
    if (!isValidPassword) {
      throw new validationError(PasswordStatus.Incorrect);
    }
    return userData;
  }

  async execute({ email, password }: SignInDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: User | (User & Trainer);
  }> {
    const userData = await this.validateUserLogin(email, password);

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userData),
      this.generateRefreshToken(userData),
    ]);

    switch (userData?.role) {
      case "trainer":
        const trainerData = await this.trainerRepository.findOne({
          userId: userData.id,
        });
        if (!trainerData) {
          throw new NotFoundError(TrainerStatus.FailedToFetchDetails);
        }
        return {
          accessToken,
          refreshToken,
          userData: { ...userData, ...trainerData },
        };

      case "admin":
        return { accessToken, refreshToken, userData };

      case "user":
        return { accessToken, refreshToken, userData };

      default:
        throw new NotFoundError(AuthStatus.InvalidRole);
    }
  }
}
