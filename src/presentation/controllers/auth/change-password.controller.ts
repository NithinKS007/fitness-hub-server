import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, PasswordStatus } from "@shared/constants/index.constants";
import { ChangePasswordUseCase } from "@application/usecases/auth/change-password.usecase";

export class ChangePasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) {}
  async handleChangePassword(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};
    const passwordData = { userId, ...req.body };

    await this.changePasswordUseCase.execute(passwordData);

    sendResponse(res, StatusCodes.OK, null, PasswordStatus.Updated);
  }
}
