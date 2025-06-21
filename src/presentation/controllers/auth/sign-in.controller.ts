import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { SigninUserUseCase } from "@application/usecases/auth/signin-user.usecase";
import { setRefreshTokenCookie } from "@shared/utils/cookie";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class SignInController {
  constructor(
    @inject(TYPES_AUTH_USECASES.SigninUserUseCase)
    private signinUseCase: SigninUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
