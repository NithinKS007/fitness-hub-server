import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, PasswordStatus } from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { IChangePasswordUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class ChangePasswordController {
  constructor(
    @inject(TYPES_AUTH_USECASES.ChangePasswordUseCase)
    private changePassword: IChangePasswordUC
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const passwordData = { userId, ...req.body };

    await this.changePassword.execute(passwordData);

    sendResponse(res, StatusCodes.OK, null, PasswordStatus.Updated);
  }
}
