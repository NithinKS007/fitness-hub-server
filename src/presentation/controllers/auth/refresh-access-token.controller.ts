import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, JwtStatus } from "@shared/constants/index.constants";
import { TokenUseCase } from "@application/usecases/auth/token.usecase";

export class RefreshAccessTokenController {
  constructor(private refreshAccessTokenUseCase: TokenUseCase) {}

  async handleRefreshAccessToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req?.cookies;

    const newAccessToken =
      await this.refreshAccessTokenUseCase.refreshAccessToken(refreshToken);

    sendResponse(
      res,
      StatusCodes.OK,
      { newAccessToken },
      JwtStatus.TokenRefreshSuccess
    );
  }
}
