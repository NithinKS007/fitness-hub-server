import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { MongoOtpRepository } from "../../infrastructure/databases/repositories/mongoOtpRepository";
import { CreateUserUseCase } from "../../domain/usecases/createUserUseCase";
import { SigninUserUseCase } from "../../domain/usecases/signInUserUseCase";
import { OtpUseCase } from "../../domain/usecases/otpUseCase";
import { ForgotPasswordUseCase } from "../../domain/usecases/forgotPasswordUseCase";
import { GoogleAuthUseCase } from "../../domain/usecases/googleAuthUseCase";
import { MonogPasswordResetRepository } from "../../infrastructure/databases/repositories/monogPasswordResetRepository";
import { UserUseCase } from "../../domain/usecases/userUseCase";
import {
  authenticateRefreshToken,
  generateAccessToken,
} from "../../infrastructure/services/jwtService";
import { JwtPayload } from "jsonwebtoken";

const mongouserRepository = new MongoUserRepository();
const mongoOtpRepository = new MongoOtpRepository();
const monogPasswordResetRepository = new MonogPasswordResetRepository();
const createUser = new CreateUserUseCase(
  mongouserRepository,
  mongoOtpRepository
);
const signinUser = new SigninUserUseCase(mongouserRepository);
const otp = new OtpUseCase(mongoOtpRepository, mongouserRepository);
const passwordReset = new ForgotPasswordUseCase(
  mongouserRepository,
  monogPasswordResetRepository
);
const googleAuth = new GoogleAuthUseCase(mongouserRepository);
const user = new UserUseCase(mongouserRepository);

export class AuthController {
  static async signup(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const createdUser = await createUser.createUser(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdUser,
        HttpStatusMessages.UserCreatedSuccessfully
      );
    } catch (error: any) {
      console.log(`Error in  signup : ${error}`);
      next(error)
    }
  }

  static async signin(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { userData, accessToken, refreshToken } = await signinUser.execute(
        req.body
      );

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
    } catch (error: any) {
      console.log(`Error in  signin : ${error}`);
      next(error)
    }
  }
  static async verifyOtp(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      await otp.verifyOtpByEmail(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.RegistrationSuccessful
      );
    } catch (error: any) {
      console.log(`Error in  verifyotp : ${error}`);
      next(error)
    }
  }
  static async resendOtp(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      console.log("body", req.body);
      await otp.resendOtp(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.OtpSendSuccessful
      );
    } catch (error: any) {
      console.log(`Error in  resendotp : ${error}`);
      next(error)
    }
  }
  static async generatePassResetLink(
    req: Request,
    res: Response,
    next:NextFunction
  ): Promise<void> {
    try {
      const tokenData = await passwordReset.generatePassResetLink(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        tokenData.email,
        HttpStatusMessages.LinkSentToEmail
      );
    } catch (error: any) {
      console.log(`Error in  sending link to reset password : ${error}`);
      next(error)
    }
  }
  static async forgotPassword(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await passwordReset.forgotPassword({
        resetToken: token,
        password: password,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.PassWordResetSuccess
      );
    } catch (error: any) {
      console.log(`Error in forgotpassword: ${error}`);
      next(error)
    }
  }
  static async createGoogleUser(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { userData, accessToken, refreshToken } =
        await googleAuth.createGoogleUser(req.body);
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
    } catch (error: any) {
      console.log(`Error to create google user: ${error}`);
      next(error)
    }
  }

  static async createTrainer(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const createdTrainer = await createUser.createTrainer(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdTrainer,
        HttpStatusMessages.UserCreatedSuccessfully
      );
    } catch (error: any) {
      console.log(`Error to create trainer: ${error}`);
      next(error)
    }
  }
  static async updateUserProfile(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      console.log("req.body", req.body)
      const updatedUserData = await user.updateUserProfile(req.body);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedUserData,
        HttpStatusMessages.UserDetailsUpdated
      );
    } catch (error: any) {
      console.log(`Error in updating user profile: ${error}`);
      next(error)
    }
  }

  static async changePassword(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { _id } = req.user;

      console.log("_id", _id, req.body);
      await user.changePassword({ _id, ...req.body });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.PasswordUpdated
      );
    } catch (error: any) {
      console.log(`Error to change password: ${error}`);
      next(error)
    }
  }

  static async signOut(req: Request, res: Response,next:NextFunction): Promise<void> {
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
      console.log(`Error in signout: ${error}`);
      next(error)
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

}
