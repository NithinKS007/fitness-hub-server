import otpGenerator from "otp-generator";
import { IOTPService } from "@application/interfaces/security/IGenerate-otp.service";
import { injectable } from "inversify";

@injectable()
export class OTPService implements IOTPService {
  generateOtp(length: number): string {
    return otpGenerator.generate(length, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }
}
