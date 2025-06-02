import { Request, Response } from "express";
import dotenv from "dotenv";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  AuthStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { GoogleAuthUseCase } from "../../../application/usecases/auth/google-auth.usecase";
import { setRefreshTokenCookie } from "../../../shared/utils/cookie";
dotenv.config();

export class GoogleAuthController {
  constructor(private googleAuthUseCase: GoogleAuthUseCase) {}
  async handleGoogleLogin(req: Request, res: Response): Promise<void> {
    const { userData, accessToken, refreshToken } =
      await this.googleAuthUseCase.execute(req.body);
    setRefreshTokenCookie(res, refreshToken);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userData, accessToken },
      AuthStatus.LoginSuccessful
    );
  }
}
