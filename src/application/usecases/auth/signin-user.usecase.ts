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
import { TrainerDTO } from "@application/dtos/trainer-dtos";
import { User } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { ISigninUserUC } from "@application/interfaces/usecases/IAuthUC";

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

  private generateAccessToken(user: User | TrainerDTO): string {
    return this.authService.createAccessToken({
      _id: user._id,
      role: user.role,
    });
  }
  private generateRefreshToken(user: User | TrainerDTO): string {
    return this.authService.createRefreshToken({
      _id: user._id,
      role: user.role,
    });
  }

  private async validateUserLogin(
    email: string,
    password: string
  ): Promise<User | TrainerDTO> {
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
    userData: User | TrainerDTO;
  }> {
    const userData = await this.validateUserLogin(email, password);

    if (userData?.role === "trainer") {
      const trainerData =
        await this.trainerRepository.getTrainerDetailsByUserIdRef(
          userData?._id.toString()
        );
      if (!trainerData) {
        throw new NotFoundError(TrainerStatus.FailedToRetrieveTrainerDetails);
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
