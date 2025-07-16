import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, JwtStatus } from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { ITokenUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class RefreshAccessTokenController {
  constructor(
    @inject(TYPES_AUTH_USECASES.TokenUseCase)
    private token: ITokenUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req?.cookies;

    const newAccessToken = await this.token.refreshToken(refreshToken);

    sendResponse(
      res,
      StatusCodes.OK,
      { newAccessToken },
      JwtStatus.TokenRefreshSuccess
    );
  }
}
