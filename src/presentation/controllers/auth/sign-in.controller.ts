import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { SigninUserUseCase } from "@application/usecases/auth/signin-user.usecase";
import { setRefreshTokenCookie } from "@shared/utils/cookie";

export class SignInController {
  constructor(private signinUseCase: SigninUserUseCase) {}
  async handleSignin(req: Request, res: Response): Promise<void> {
    const { userData, accessToken, refreshToken } =
      await this.signinUseCase.execute(req.body);

    setRefreshTokenCookie(res, refreshToken);

    sendResponse(
      res,
      StatusCodes.OK,
      { userData, accessToken },
      AuthStatus.LoginSuccess
    );
  }
}
