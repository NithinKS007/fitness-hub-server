import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/user.entities";
import {
  AuthStatus,
  PasswordStatus,
  TrainerStatus,
} from "../../../shared/constants/index.constants";
import { SignInDTO } from "../../dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "../../../presentation/middlewares/error.middleware";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { Trainer } from "../../../domain/entities/trainer.entities";
import { IAuthService } from "../../interfaces/auth/IAuth.service";
import { IPasswordService } from "../../interfaces/security/IPassword.service";

export class SigninUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository,
    private authService: IAuthService,
    private passwordService: IPasswordService
  ) {}

  private generateAccessToken(user: User | Trainer): string {
    return this.authService.generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }
  private generateRefreshToken(user: User | Trainer): string {
    return this.authService.generateRefreshToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }

  private async validateUserLogin(
    email: string,
    password: string
  ): Promise<User | Trainer> {
    const userData = await this.userRepository.findByEmail({ email: email });
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
    const isValidPassword = await this.passwordService.comparePassword(
      password,
      userData?.password
    );
    if (!isValidPassword) {
      throw new validationError(PasswordStatus.IncorrectPassword);
    }
    return userData;
  }

  async execute({ email, password }: SignInDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: User | Trainer;
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
