import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, PasswordStatus } from "@shared/constants/index.constants";
import { ForgotPasswordUseCase } from "@application/usecases/auth/forgot-password.usecase";

export class ForgotPasswordController {
  constructor(private forgotPasswordUseCase: ForgotPasswordUseCase) {}
  async handleForgotPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const { password } = req.body;

    const resetData = { resetToken: token, password: password };

    await this.forgotPasswordUseCase.execute(resetData);

    sendResponse(res, StatusCodes.OK, null, PasswordStatus.ResetSuccess);
  }
}
