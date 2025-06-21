import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {
  AuthStatus,
  PasswordStatus,
  TrainerStatus,
} from "@shared/constants/index.constants";
import { SignInDTO } from "@application/dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import { IAuthService } from "@application/interfaces/auth/IAuth.service";
import { IEncryptionService } from "@application/interfaces/security/IEncryption.service";
import { Trainer } from "@application/dtos/trainer-dtos";
import { IUser } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

/**
 * Purpose: Handle the sign-in process for a user or trainer.
 * Incoming: { email, password } - User credentials for authentication.
 * Returns: { accessToken, refreshToken, userData } - JWT tokens and user data.
 * Throws: Error if user data is invalid, OTP not verified, or password is incorrect.
 */

@injectable()
export class SigninUserUseCase {
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

  private generateAccessToken(user: IUser | Trainer): string {
    return this.authService.generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }
  private generateRefreshToken(user: IUser | Trainer): string {
    return this.authService.generateRefreshToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }

  private async validateUserLogin(
    email: string,
    password: string
  ): Promise<IUser | Trainer> {
    const userData = await this.userRepository.findOne({ email: email });
    if (!userData) {
      throw new validationError(AuthStatus.EmailNotFound);
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
    userData: IUser | Trainer;
  }> {
    const userData = await this.validateUserLogin(email, password);

    if (userData?.role === "trainer") {
      const trainerData =
        await this.trainerRepository.getTrainerDetailsByUserIdRef(
          userData?._id.toString()
        );
      if (!trainerData) {
        throw new validationError(TrainerStatus.FailedToRetrieveTrainerDetails);
      }
      const accessToken = this.generateAccessToken(trainerData);
      const refreshToken = this.generateRefreshToken(trainerData);
      return { accessToken, refreshToken, userData: trainerData };
    } else {
      const accessToken = this.generateAccessToken(userData);
      const refreshToken = this.generateRefreshToken(userData);
      return { accessToken, refreshToken, userData };
    }
  }
}
