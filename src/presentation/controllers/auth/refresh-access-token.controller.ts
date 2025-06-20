import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, JwtStatus } from "@shared/constants/index.constants";
import { TokenUseCase } from "@application/usecases/auth/token.usecase";
import { TYPES_AUTH_USECASES } from "di/types-usecases";

@injectable()
export class RefreshAccessTokenController {
  constructor(
    @inject(TYPES_AUTH_USECASES.TokenUseCase)
    private tokenUseCase: TokenUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req?.cookies;

    const newAccessToken = await this.tokenUseCase.refreshAccessToken(
      refreshToken
    );

    sendResponse(
      res,
      StatusCodes.OK,
      { newAccessToken },
      JwtStatus.TokenRefreshSuccess
    );
  }
}
