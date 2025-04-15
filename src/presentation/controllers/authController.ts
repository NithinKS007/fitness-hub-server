import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { CreateUserUseCase } from "../../application/usecases/createUserUseCase";
import { SigninUserUseCase } from "../../application/usecases/signInUserUseCase";
import { OtpUseCase } from "../../application/usecases/otpUseCase";
import { PasswordUseCase } from "../../application/usecases/passwordUseCase";
import { GoogleAuthUseCase } from "../../application/usecases/googleAuthUseCase";
import {
  authenticateRefreshToken,
  generateAccessToken,
} from "../../infrastructure/services/jwtService";
import { JwtPayload } from "jsonwebtoken";
import { CreateTrainerUseCase } from "../../application/usecases/createTrainerUseCase";
import { UpdateProfileUseCase } from "../../application/usecases/updateProfileUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";
import { MonogPasswordResetRepository } from "../../infrastructure/databases/repositories/passwordResetRepository";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/userRepository";
import { MongoOtpRepository } from "../../infrastructure/databases/repositories/otpRepository";
import logger from "../../infrastructure/logger/logger";
import { handleLogError } from "../../shared/utils/handleLogError";

//MONGO REPOSITORY INSTANCES
const mongoUserRepository = new MongoUserRepository();
const monogTrainerRepository = new MongoTrainerRepository();
const mongoOtpRepository = new MongoOtpRepository();
const monogPasswordResetRepository = new MonogPasswordResetRepository();

//USE CASE INSTANCES
const createUserUseCase = new CreateUserUseCase(
  mongoUserRepository,
  mongoOtpRepository
);
const signinUseCase = new SigninUserUseCase(
  mongoUserRepository,
  monogTrainerRepository
);
const otpUseCase = new OtpUseCase(mongoOtpRepository, mongoUserRepository);
const passwordUseCase = new PasswordUseCase(
  mongoUserRepository,
  monogPasswordResetRepository
);
const googleAuthUseCase = new GoogleAuthUseCase(mongoUserRepository);
const profileUseCase = new UpdateProfileUseCase(
  mongoUserRepository,
  monogTrainerRepository
);
const createTrainerUseCase = new CreateTrainerUseCase(
  mongoUserRepository,
  mongoOtpRepository,
  monogTrainerRepository
);

export class AuthController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createdUser = await createUserUseCase.create(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdUser,
        HttpStatusMessages.UserCreatedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.createUser",
        "Error in create User"
      );
      next(error);
    }
  }

  static async createTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createdTrainer = await createTrainerUseCase.create(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdTrainer,
        HttpStatusMessages.UserCreatedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.createTrainer",
        "Error to create trainer"
      );
      next(error);
    }
  }

  static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userData, accessToken, refreshToken } =
        await signinUseCase.signIn(req.body);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userData, accessToken },
        HttpStatusMessages.LoginSuccessful
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.signin",
        "Error during sign-in"
      );
      next(error);
    }
  }

  static async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await otpUseCase.verifyOtpByEmail(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.RegistrationSuccessful
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.verifyOtp",
        "Error verifying otp "
      );
      next(error);
    }
  }

  static async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await otpUseCase.resendOtp(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.OtpSendSuccessful
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.resendOtp",
        "Error resending OTP"
      );
      next(error);
    }
  }

  static async generatePassResetLink(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tokenData = await passwordUseCase.generatePassResetLink(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        tokenData.email,
        HttpStatusMessages.LinkSentToEmail
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.generatePassResetLink",
        "Error sending password reset link"
      );
      next(error);
    }
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await passwordUseCase.forgotPassword({
        resetToken: token,
        password: password,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.PassWordResetSuccess
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.forgotPassword",
        "Error in forgotpassword"
      );
      next(error);
    }
  }

  static async createGoogleUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userData, accessToken, refreshToken } =
        await googleAuthUseCase.createGoogleUser(req.body);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userData, accessToken },
        HttpStatusMessages.LoginSuccessful
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.createGoogleUser",
        "Error creating Google user"
      );
      next(error);
    }
  }

  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      await passwordUseCase.changePassword({ userId, ...req.body });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.PasswordUpdated
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.changePassword",
        "Error changing password"
      );
      next(error);
    }
  }
  static async signOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.LogoutSuccessful
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.signOut",
        "Error during sign-out"
      );
      next(error);
    }
  }
  static async refreshAccessToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
      sendResponse(
        res,
        HttpStatusCodes.Forbidden,
        null,
        HttpStatusMessages.NoRefreshToken
      );
      return;
    }
    const decoded = authenticateRefreshToken(refreshToken) as JwtPayload;
    const newAccessToken = generateAccessToken(decoded._id, decoded.role);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { newAccessToken },
      HttpStatusMessages.AccessTokenRefreshedSuccessFully
    );
  }

  static async updateTrainerProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const updatedTrainerData = await profileUseCase.updateTrainerProfile({
        trainerId,
        ...req.body,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedTrainerData,
        HttpStatusMessages.UserDetailsUpdated
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.updateTrainerProfile",
        "Error updating trainer profile"
      );
      next(error);
    }
  }
  static async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const updatedUserData = await profileUseCase.updateUserProfile({
        userId,
        ...req.body,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedUserData,
        HttpStatusMessages.UserDetailsUpdated
      );
    } catch (error) {
      handleLogError(
        error,
        "AuthController.updateUserProfile",
        "Error updating user profile"
      );
      next(error);
    }
  }
}
