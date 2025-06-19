import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  AuthStatus,
  StatusCodes,
  OTPStatus,
} from "@shared/constants/index.constants";
import { OtpUseCase } from "@application/usecases/auth/otp.usecase";
import { TYPES_AUTH_USECASES } from "di/types-usecases";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES_AUTH_USECASES.OtpUseCase) private otpUseCase: OtpUseCase
  ) {}

  async verifyOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.verifyOtp(req.body);

    sendResponse(res, StatusCodes.OK, null, AuthStatus.RegistrationSuccess);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.resendOtp(req.body);

    sendResponse(res, StatusCodes.OK, null, OTPStatus.Sent);
  }
}
