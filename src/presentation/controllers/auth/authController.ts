import { Request, Response } from "express";
import dotenv from "dotenv";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  AuthStatus,
  HttpStatusCodes,
  JwtStatus,
  OTPStatus,
  PasswordStatus,
  ProfileStatus,
} from "../../../shared/constants/index-constants";

import { CreateUserUseCase } from "../../../application/usecases/auth/createUserUseCase";
import { SigninUserUseCase } from "../../../application/usecases/auth/signInUserUseCase";
import { OtpUseCase } from "../../../application/usecases/auth/otpUseCase";
import { PasswordUseCase } from "../../../application/usecases/auth/passwordUseCase";
import { GoogleAuthUseCase } from "../../../application/usecases/auth/googleAuthUseCase";
import { CreateTrainerUseCase } from "../../../application/usecases/auth/createTrainerUseCase";
import { UpdateProfileUseCase } from "../../../application/usecases/auth/updateProfileUseCase";
import { TokenUseCase } from "../../../application/usecases/auth/tokenUseCase";
import { UpdateUserDetailsDTO } from "../../../application/dtos/user-dtos";
dotenv.config();

export class AuthController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private signinUseCase: SigninUserUseCase,
    private otpUseCase: OtpUseCase,
    private passwordUseCase: PasswordUseCase,
    private googleAuthUseCase: GoogleAuthUseCase,
    private profileUseCase: UpdateProfileUseCase,
    private createTrainerUseCase: CreateTrainerUseCase,
    private refreshAccessTokenUseCase: TokenUseCase
  ) {}

  public async createUser(req: Request, res: Response): Promise<void> {
    const createdUser = await this.createUserUseCase.create(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdUser,
      AuthStatus.UserCreatedSuccessfully
    );
  }

  public async createTrainer(req: Request, res: Response): Promise<void> {
    const createdTrainer = await this.createTrainerUseCase.create(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdTrainer,
      AuthStatus.UserCreatedSuccessfully
    );
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const { userData, accessToken, refreshToken } = await this.signinUseCase.signIn(
      req.body
    );

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
      AuthStatus.LoginSuccessful
    );
  }

  public async verifyOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.verifyOtpByEmail(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      null,
      AuthStatus.RegistrationSuccessful
    );
  }

  public async resendOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.resendOtp(req.body);
    sendResponse(res, HttpStatusCodes.OK, null, OTPStatus.OtpSendSuccessful);
  }

  public async generatePassResetLink(
    req: Request,
    res: Response
  ): Promise<void> {
    const tokenData = await this.passwordUseCase.generatePassResetLink(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      tokenData.email,
      AuthStatus.LinkSentToEmail
    );
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const { password } = req.body;
    await this.passwordUseCase.forgotPassword({
      resetToken: token,
      password: password,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      null,
      PasswordStatus.PassWordResetSuccess
    );
  }

  public async createGoogleUser(req: Request, res: Response): Promise<void> {
    const { userData, accessToken, refreshToken } =
      await this.googleAuthUseCase.createGoogleUser(req.body);
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
      AuthStatus.LoginSuccessful
    );
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    await this.passwordUseCase.changePassword({ userId, ...req.body });
    sendResponse(res, HttpStatusCodes.OK, null, PasswordStatus.PasswordUpdated);
  }
  public async signOut(req: Request, res: Response): Promise<void> {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "strict",
      secure: process.env.NODE_ENV === "PRODUCTION",
    });
    sendResponse(res, HttpStatusCodes.OK, null, AuthStatus.LogoutSuccessful);
  }
  public async refreshAccessToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req?.cookies?.refreshToken;
    const newAccessToken = await this.refreshAccessTokenUseCase.refreshAccessToken(
      refreshToken
    );

    sendResponse(
      res,
      HttpStatusCodes.OK,
      { newAccessToken },
      JwtStatus.AccessTokenRefreshedSuccessFully
    );
  }

  public async updateTrainerProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const updatedTrainerData = await this.profileUseCase.updateTrainerProfile({
      trainerId,
      ...req.body,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedTrainerData,
      ProfileStatus.UserDetailsUpdated
    );
  }
  public async updateUserProfile(req: Request, res: Response): Promise<void> {
    const { userId, ...bodyWithoutUserId } = req.body;
    const updatedUserData = await this.profileUseCase.updateUserProfile({
      userId: req.user._id,
      ...bodyWithoutUserId,
    } as UpdateUserDetailsDTO);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedUserData,
      ProfileStatus.UserDetailsUpdated
    );
  }
}
