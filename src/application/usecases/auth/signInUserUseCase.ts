import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/user";
import { comparePassword } from "../../../shared/utils/hashPassword";
import {
  AuthenticationStatusMessage,
  PasswordStatusMessage,
  TrainerStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { SignInDTO } from "../../dtos/authDTOs";
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
      throw new validationError(AuthenticationStatusMessage.EmailNotFound);
    }
    if (userData && userData?.googleVerified) {
      throw new validationError(
        AuthenticationStatusMessage.DifferentLoginMethod
      );
    }
    if (!userData?.otpVerified) {
      throw new ForbiddenError(AuthenticationStatusMessage.AccountNotVerified);
    }
    if (userData?.isBlocked) {
      throw new ForbiddenError(AuthenticationStatusMessage.AccountBlocked);
    }
    const isValidPassword = await comparePassword(password, userData?.password);
    if (!isValidPassword) {
      throw new validationError(PasswordStatusMessage.IncorrectPassword);
    }
    if (userData?.role === "trainer") {
      const trainerData =
        await this.trainerRepository.getTrainerDetailsByUserIdRef(
          userData?._id.toString()
        );
      if (!trainerData) {
        throw new validationError(
          TrainerStatusMessage.FailedToRetrieveTrainerDetails
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
