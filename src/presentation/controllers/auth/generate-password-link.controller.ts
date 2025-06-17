import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { SendPasswordRestLinkUseCase } from "@application/usecases/auth/send-password-reset-ink.usecase";

export class PasswordResetLinkController {
  constructor(
    private sendPasswordRestLinkUseCase: SendPasswordRestLinkUseCase
  ) {}
  async handleResetLink(req: Request, res: Response): Promise<void> {
    const tokenData = await this.sendPasswordRestLinkUseCase.execute(req.body);

    sendResponse(res, StatusCodes.OK, tokenData.email, AuthStatus.EmailSent);
  }
}
