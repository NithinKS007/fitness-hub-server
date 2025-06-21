import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, PasswordStatus } from "@shared/constants/index.constants";
import { ChangePasswordUseCase } from "@application/usecases/auth/change-password.usecase";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class ChangePasswordController {
  constructor(
    @inject(TYPES_AUTH_USECASES.ChangePasswordUseCase)
    private changePasswordUseCase: ChangePasswordUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};
    const passwordData = { userId, ...req.body };

    await this.changePasswordUseCase.execute(passwordData);

    sendResponse(res, StatusCodes.OK, null, PasswordStatus.Updated);
  }
}
