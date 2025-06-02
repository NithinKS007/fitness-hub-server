import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  AuthStatus,
  HttpStatusCodes,
  JwtStatus,
} from "../../../shared/constants/index.constants";
import { SigninUserUseCase } from "../../../application/usecases/auth/signin-user.usecase";
import { TokenUseCase } from "../../../application/usecases/auth/token.usecase";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from "../../../shared/utils/cookie";

export class UserSessionController {
  constructor(
    private signinUseCase: SigninUserUseCase,
    private refreshAccessTokenUseCase: TokenUseCase
  ) {}
  async signin(req: Request, res: Response): Promise<void> {
    const { userData, accessToken, refreshToken } =
      await this.signinUseCase.execute(req.body);
    setRefreshTokenCookie(res, refreshToken);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userData, accessToken },
      AuthStatus.LoginSuccessful
    );
  }

  async signOut(req: Request, res: Response): Promise<void> {
    clearRefreshTokenCookie(res);
    sendResponse(res, HttpStatusCodes.OK, null, AuthStatus.LogoutSuccessful);
  }

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req?.cookies?.refreshToken;
    const newAccessToken =
      await this.refreshAccessTokenUseCase.refreshAccessToken(refreshToken);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { newAccessToken },
      JwtStatus.AccessTokenRefreshedSuccessFully
    );
  }
}
