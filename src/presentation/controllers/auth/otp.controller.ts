import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  AuthStatus,
  StatusCodes,
  OTPStatus,
} from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { IOtpUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class OtpController {
  constructor(@inject(TYPES_AUTH_USECASES.OtpUseCase) private otp: IOtpUC) {}

  async verifyOtp(req: Request, res: Response): Promise<void> {
    await this.otp.verifyOtp(req.body);

    sendResponse(res, StatusCodes.OK, null, AuthStatus.RegistrationSuccess);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    await this.otp.resendOtp(req.body);

    sendResponse(res, StatusCodes.Created, null, OTPStatus.Sent);
  }
}
