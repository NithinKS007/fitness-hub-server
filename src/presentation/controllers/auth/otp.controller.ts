import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import {
  AuthStatus,
  StatusCodes,
  OTPStatus,
} from "@shared/constants/index.constants";
import { OtpUseCase } from "@application/usecases/auth/otp.usecase";

export class OtpController {
  constructor(private otpUseCase: OtpUseCase) {}

  async verifyOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.verifyOtp(req.body);

    sendResponse(res, StatusCodes.OK, null, AuthStatus.RegistrationSuccess);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.resendOtp(req.body);

    sendResponse(res, StatusCodes.OK, null, OTPStatus.Sent);
  }
}
