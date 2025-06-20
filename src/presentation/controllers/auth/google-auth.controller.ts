import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { GoogleAuthUseCase } from "@application/usecases/auth/google-auth.usecase";
import { setRefreshTokenCookie } from "@shared/utils/cookie";
import { TYPES_AUTH_USECASES } from "di/types-usecases";

@injectable()
export class GoogleAuthController {
  constructor(
    @inject(TYPES_AUTH_USECASES.GoogleAuthUseCase)
    private googleAuthUseCase: GoogleAuthUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userData, accessToken, refreshToken } =
      await this.googleAuthUseCase.execute(req.body);

    setRefreshTokenCookie(res, refreshToken);

    sendResponse(
      res,
      StatusCodes.OK,
      { userData, accessToken },
      AuthStatus.LoginSuccess
    );
  }
}
