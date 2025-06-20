import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, PasswordStatus } from "@shared/constants/index.constants";
import { ForgotPasswordUseCase } from "@application/usecases/auth/forgot-password.usecase";
import { TYPES_AUTH_USECASES } from "di/types-usecases";

@injectable()
export class ForgotPasswordController {
  constructor(
    @inject(TYPES_AUTH_USECASES.ForgotPasswordUseCase)
    private forgotPasswordUseCase: ForgotPasswordUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const { password } = req.body;

    const resetData = { resetToken: token, password: password };

    await this.forgotPasswordUseCase.execute(resetData);

    sendResponse(res, StatusCodes.OK, null, PasswordStatus.ResetSuccess);
  }
}
