import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  AuthStatus,
  HttpStatusCodes,
  OTPStatus,
} from "../../../shared/constants/index.constants";
import { OtpUseCase } from "../../../application/usecases/auth/otp.usecase";

export class OtpController {
  constructor(private otpUseCase: OtpUseCase) {}
  async verifyOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.verifyOtp(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      null,
      AuthStatus.RegistrationSuccessful
    );
  }
  async resendOtp(req: Request, res: Response): Promise<void> {
    await this.otpUseCase.resendOtp(req.body);
    sendResponse(res, HttpStatusCodes.OK, null, OTPStatus.OtpSendSuccessful);
  }
}
