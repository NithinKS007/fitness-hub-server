import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  AuthStatus,
  HttpStatusCodes,
  PasswordStatus,
} from "../../../shared/constants/index.constants";

import { PasswordUseCase } from "../../../application/usecases/auth/password.usecase";

export class PasswordController {
  constructor(private passwordUseCase: PasswordUseCase) {}
  async generateResetLink(req: Request, res: Response): Promise<void> {
    const tokenData = await this.passwordUseCase.generateResetLink(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      tokenData.email,
      AuthStatus.LinkSentToEmail
    );
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const resetData = {
      resetToken: req.params.token,
      password: req.body.password,
    };
    await this.passwordUseCase.forgotPassword(resetData);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      null,
      PasswordStatus.PassWordResetSuccess
    );
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const passwordData = {
      userId: req?.user?._id,
      ...req.body,
    };
    await this.passwordUseCase.changePassword(passwordData);
    sendResponse(res, HttpStatusCodes.OK, null, PasswordStatus.PasswordUpdated);
  }
}
