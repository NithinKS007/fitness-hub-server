import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User } from "../../domain/entities/userEntity";
import { comparePassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { SignInDTO } from "../dtos/authDTOs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../infrastructure/services/jwtService";
import {
  ForbiddenError,
  validationError,
} from "../../presentation/middlewares/errorMiddleWare";
import { ITrainerRepository } from "../../domain/interfaces/ITrainerRepository";
import { Trainer } from "../../domain/entities/trainerEntity";

export class SigninUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository
  ) {}

  public async signIn({
    email,
    password,
  }: SignInDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: User | Trainer;
  }> {
    const userData = await this.userRepository.findByEmail({ email: email });
    if (!userData) {
      throw new validationError(HttpStatusMessages.EmailNotFound);
    }
    if (userData && userData?.googleVerified) {
      throw new validationError(HttpStatusMessages.DifferentLoginMethod);
    }
    if (!userData?.otpVerified) {
      throw new ForbiddenError(HttpStatusMessages.AccountNotVerified);
    }
    if (userData?.isBlocked) {
      throw new ForbiddenError(HttpStatusMessages.AccountBlocked);
    }
    const isValidPassword = await comparePassword(password, userData?.password);
    if (!isValidPassword) {
      throw new validationError(HttpStatusMessages.IncorrectPassword);
    }
    if (userData?.role === "trainer") {
      const trainerData =
        await this.trainerRepository.getTrainerDetailsByUserIdRef(
          userData?._id.toString()
        );
      if (!trainerData) {
        throw new validationError(
          HttpStatusMessages.FailedToRetrieveTrainerDetails
        );
      }
      const accessToken = generateAccessToken(
        trainerData._id.toString(),
        trainerData.role
      );
      const refreshToken = generateRefreshToken(
        trainerData._id.toString(),
        trainerData.role
      );

      return { accessToken, refreshToken, userData: trainerData };
    } else {
      const accessToken = generateAccessToken(
        userData._id.toString(),
        userData.role
      );
      const refreshToken = generateRefreshToken(
        userData._id.toString(),
        userData.role
      );
      return { accessToken, refreshToken, userData };
    }
  }
}
