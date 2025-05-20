import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  AuthenticationStatusMessage,
  HttpStatusCodes,
  JWTStatusMessage,
  OTPStatusMessage,
  PasswordStatusMessage,
  ProfileStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { CreateUserUseCase } from "../../../application/usecases/auth/createUserUseCase";
import { SigninUserUseCase } from "../../../application/usecases/auth/signInUserUseCase";
import { OtpUseCase } from "../../../application/usecases/auth/otpUseCase";
import { PasswordUseCase } from "../../../application/usecases/auth/passwordUseCase";
import { GoogleAuthUseCase } from "../../../application/usecases/auth/googleAuthUseCase";
import { CreateTrainerUseCase } from "../../../application/usecases/auth/createTrainerUseCase";
import { UpdateProfileUseCase } from "../../../application/usecases/auth/updateProfileUseCase";
import { MongoTrainerRepository } from "../../../infrastructure/databases/repositories/trainerRepository";
import { MonogPasswordResetRepository } from "../../../infrastructure/databases/repositories/passwordResetRepository";
import { MongoUserRepository } from "../../../infrastructure/databases/repositories/userRepository";
import { MongoOtpRepository } from "../../../infrastructure/databases/repositories/otpRepository";
import { JwtService } from "../../../infrastructure/services/auth/jwtService";
import { TokenUseCase } from "../../../application/usecases/auth/tokenUseCase";
import { CloudinaryService } from "../../../infrastructure/services/storage/cloudinaryService";
import { GoogleAuthService } from "../../../infrastructure/services/auth/googleAuthService";
import { EmailService } from "../../../infrastructure/services/communication/emailService";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import dotenv from "dotenv";
import { UpdateUserDetailsDTO } from "../../../application/dtos/user-dtos";
dotenv.config();
//MONGO REPOSITORY INSTANCES
const mongoUserRepository = new MongoUserRepository();
const monogTrainerRepository = new MongoTrainerRepository();
const mongoOtpRepository = new MongoOtpRepository();
const monogPasswordResetRepository = new MonogPasswordResetRepository();

//SERVICE INSTANCES
const cloudinaryService = new CloudinaryService();
const jwtService = new JwtService();
const emailService = new EmailService();
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);
const googleAuthService = new GoogleAuthService();

//USE CASE INSTANCES
const createUserUseCase = new CreateUserUseCase(
  mongoUserRepository,
  mongoOtpRepository,
  emailService
);
const signinUseCase = new SigninUserUseCase(
  mongoUserRepository,
  monogTrainerRepository,
  jwtService
);
const otpUseCase = new OtpUseCase(
  mongoOtpRepository,
  mongoUserRepository,
  emailService
);
const passwordUseCase = new PasswordUseCase(
  mongoUserRepository,
  monogPasswordResetRepository,
  emailService
);

const googleAuthUseCase = new GoogleAuthUseCase(
  mongoUserRepository,
  jwtService,
  googleAuthService
);
const profileUseCase = new UpdateProfileUseCase(
  mongoUserRepository,
  monogTrainerRepository,
  cloudinaryService
);
const createTrainerUseCase = new CreateTrainerUseCase(
  mongoUserRepository,
  mongoOtpRepository,
  monogTrainerRepository,
  emailService
);
const refreshAccessTokenUseCase = new TokenUseCase(jwtService);

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
        AuthenticationStatusMessage.UserCreatedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        AuthenticationStatusMessage.UserCreatedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "strict",
        secure: process.env.NODE_ENV === "PRODUCTION",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userData, accessToken },
        AuthenticationStatusMessage.LoginSuccessful
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        AuthenticationStatusMessage.RegistrationSuccessful
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        OTPStatusMessage.OtpSendSuccessful
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        AuthenticationStatusMessage.LinkSentToEmail
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        PasswordStatusMessage.PassWordResetSuccess
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        AuthenticationStatusMessage.LoginSuccessful
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        PasswordStatusMessage.PasswordUpdated
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "strict",
        secure: process.env.NODE_ENV === "PRODUCTION",
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        AuthenticationStatusMessage.LogoutSuccessful
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AuthController.signOut",
        "Error during sign-out"
      );
      next(error);
    }
  }
  static async refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req?.cookies?.refreshToken;
      const newAccessToken = await refreshAccessTokenUseCase.refreshAccessToken(
        refreshToken
      );

      sendResponse(
        res,
        HttpStatusCodes.OK,
        { newAccessToken },
        JWTStatusMessage.AccessTokenRefreshedSuccessFully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AuthController.refreshAccessToken",
        "Error to refresh access token"
      );
      next(error);
    }
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
        ProfileStatusMessage.UserDetailsUpdated
      );
    } catch (error) {
      loggerHelper.handleLogError(
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
      const { userId, ...bodyWithoutUserId } = req.body;
      const updatedUserData = await profileUseCase.updateUserProfile({
        userId: req.user._id,
        ...bodyWithoutUserId,
      } as UpdateUserDetailsDTO);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedUserData,
        ProfileStatusMessage.UserDetailsUpdated
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "AuthController.updateUserProfile",
        "Error updating user profile"
      );
      next(error);
    }
  }
}
