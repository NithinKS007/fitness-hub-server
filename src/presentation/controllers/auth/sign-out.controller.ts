import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { clearRefreshTokenCookie } from "@shared/utils/cookie";

export class SignOutController {
  async handleSignOut(req: Request, res: Response): Promise<void> {
    clearRefreshTokenCookie(res);

    sendResponse(res, StatusCodes.OK, null, AuthStatus.LogoutSuccess);
  }
}
