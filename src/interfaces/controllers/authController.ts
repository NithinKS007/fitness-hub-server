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

//MONGO REPOSITORY INSTANCES
const mongoUserRepository = new MongoUserRepository();
const monogTrainerRepository = new MongoTrainerRepository()
const mongoOtpRepository = new MongoOtpRepository();
const monogPasswordResetRepository = new MonogPasswordResetRepository()

//USE CASE INSTANCES
const createUserUseCase = new CreateUserUseCase(mongoUserRepository, mongoOtpRepository);
const signinUseCase = new SigninUserUseCase(mongoUserRepository,monogTrainerRepository);
const otpUseCase = new OtpUseCase(mongoOtpRepository, mongoUserRepository);
const passwordUseCase = new PasswordUseCase(mongoUserRepository, monogPasswordResetRepository);
const googleAuthUseCase = new GoogleAuthUseCase(mongoUserRepository);
const profileUseCase = new UpdateProfileUseCase(mongoUserRepository,monogTrainerRepository)
const createTrainerUseCase = new CreateTrainerUseCase(mongoUserRepository,mongoOtpRepository,monogTrainerRepository)

export class AuthController {
static async createUser(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const createdUser = await createUserUseCase.create(req.body);
    sendResponse(res,HttpStatusCodes.OK,createdUser,HttpStatusMessages.UserCreatedSuccessfully);
  } catch (error: any) {
    console.log(`Error in create User: ${error}`);
    next(error)
  }
}

static async createTrainer(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const createdTrainer = await createTrainerUseCase.create(req.body);
    sendResponse(res,HttpStatusCodes.OK,createdTrainer,HttpStatusMessages.UserCreatedSuccessfully);
  } catch (error: any) {
    console.log(`Error to create trainer: ${error}`);
    next(error)
  }
}

static async signin(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { userData, accessToken, refreshToken } = await signinUseCase.signIn(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res,HttpStatusCodes.OK,{ userData, accessToken },HttpStatusMessages.LoginSuccessful);
  } catch (error: any) {
    console.log(`Error during sign-in: ${error}`);
    next(error)
  }
}

static async verifyOtp(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    await otpUseCase.verifyOtpByEmail(req.body);
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.RegistrationSuccessful);
  } catch (error: any) {
    console.log(`Error verifying otp : ${error}`);
    next(error)
  }
}

static async resendOtp(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    await otpUseCase.resendOtp(req.body);
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.OtpSendSuccessful);
  } catch (error: any) {
    console.log(`Error resending OTP: ${error}`);
    next(error)
  }
}

static async generatePassResetLink(req: Request, res: Response, next:NextFunction): Promise<void> {
  try {
    const tokenData = await passwordUseCase.generatePassResetLink(req.body);
    sendResponse(res,HttpStatusCodes.OK,tokenData.email,HttpStatusMessages.LinkSentToEmail);
  } catch (error: any) {
    console.log(`Error sending password reset link: ${error}`);
    next(error)
  }
}

static async forgotPassword(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await passwordUseCase.forgotPassword({resetToken: token,password: password});
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.PassWordResetSuccess);
  } catch (error: any) {
    console.log(`Error in forgotpassword: ${error}`);
    next(error)
  }
}

static async createGoogleUser(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { userData, accessToken, refreshToken } = await googleAuthUseCase.createGoogleUser(req.body);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res,HttpStatusCodes.OK,{ userData, accessToken },HttpStatusMessages.LoginSuccessful);
  } catch (error: any) {
    console.log(`Error creating Google user: ${error}`);
    next(error)
  }
}

static async changePassword(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { _id } = req.user;
    await passwordUseCase.changePassword({ _id,...req.body });
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.PasswordUpdated);
  } catch (error: any) {
    console.log(`Error changing password: ${error}`);
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
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.LogoutSuccessful);
  } catch (error) {
    console.log(`Error during sign-out: ${error}`);
    next(error)
  }
}
static async refreshAccessToken(req: Request, res: Response): Promise<void> {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) {
    sendResponse(res,HttpStatusCodes.Forbidden,null,HttpStatusMessages.NoRefreshToken);
    return;
  }
  const decoded = authenticateRefreshToken(refreshToken) as JwtPayload;
  const newAccessToken = generateAccessToken(decoded._id, decoded.role);
  sendResponse(res,HttpStatusCodes.OK,{ newAccessToken },HttpStatusMessages.AccessTokenRefreshedSuccessFully);
}

static async updateTrainerProfile(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const {_id} = req.user
    const updatedTrainerData = await profileUseCase.updateTrainerProfile({_id,...req.body});
    sendResponse(res,HttpStatusCodes.OK,updatedTrainerData,HttpStatusMessages.UserDetailsUpdated);
  } catch (error: any) {
    console.log(`Error updating trainer profile: ${error}`);
    next(error)
  }
}
static async updateUserProfile(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    const {_id} = req.user
    const updatedUserData = await profileUseCase.updateUserProfile({_id,...req.body});
    sendResponse(res,HttpStatusCodes.OK,updatedUserData,HttpStatusMessages.UserDetailsUpdated);
  } catch (error:any) {
    console.log(`Error updating user profile: ${error}`);
    next(error)
  }
}

}
