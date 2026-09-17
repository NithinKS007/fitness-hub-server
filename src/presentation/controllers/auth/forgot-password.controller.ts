import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, PasswordStatus } from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { IForgotPasswordUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class ForgotPasswordController {
  constructor(
    @inject(TYPES_AUTH_USECASES.ForgotPasswordUseCase)
    private forgotPassword: IForgotPasswordUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const { password } = req.body;

    const resetData = { resetToken: token, password: password };
    await this.forgotPassword.execute(resetData);
    sendResponse(res, StatusCodes.OK, null, PasswordStatus.ResetSuccess);
  }
}
