import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/user";
import { comparePassword } from "../../../shared/utils/hashPassword";
import {
  AuthStatus,
  PasswordStatus,
  TrainerStatus,
} from "../../../shared/constants/index-constants";
import { SignInDTO } from "../../dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "../../../presentation/middlewares/errorMiddleWare";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { Trainer } from "../../../domain/entities/trainer";
import { IAuthService } from "../../interfaces/auth/IAuthService";

export class SigninUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository,
    private authService: IAuthService
  ) {}

  public async signIn({ email, password }: SignInDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: User | Trainer;
  }> {
    const userData = await this.userRepository.findByEmail({ email: email });
    if (!userData) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
    if (userData && userData?.googleVerified) {
      throw new validationError(
        AuthStatus.DifferentLoginMethod
      );
    }
    if (!userData?.otpVerified) {
      throw new ForbiddenError(AuthStatus.AccountNotVerified);
    }
    if (userData?.isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }
    const isValidPassword = await comparePassword(password, userData?.password);
    if (!isValidPassword) {
      throw new validationError(PasswordStatus.IncorrectPassword);
    }
    if (userData?.role === "trainer") {
      const trainerData =
        await this.trainerRepository.getTrainerDetailsByUserIdRef(
          userData?._id.toString()
        );
      if (!trainerData) {
        throw new validationError(
          TrainerStatus.FailedToRetrieveTrainerDetails
        );
      }
      const accessToken = this.authService.generateAccessToken({
        _id: trainerData._id.toString(),
        role: trainerData.role,
      });
      const refreshToken = this.authService.generateRefreshToken({
        _id: trainerData._id.toString(),
        role: trainerData.role,
      });

      return { accessToken, refreshToken, userData: trainerData };
    } else {
      const accessToken = this.authService.generateAccessToken({
        _id: userData._id.toString(),
        role: userData.role,
      });
      const refreshToken = this.authService.generateRefreshToken({
        _id: userData._id.toString(),
        role: userData.role,
      });
      return { accessToken, refreshToken, userData };
    }
  }
}
