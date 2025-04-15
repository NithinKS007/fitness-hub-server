import { OtpDTO } from "../../application/dtos/authDTOs";
import { Otp } from "../entities/otpEntity";

export interface IOtpRepository {
  createOtp(createOTP: OtpDTO): Promise<Otp>;
  verifyOtpByEmail(verifyOTP: OtpDTO): Promise<Otp | null>;
  deleteOtp(deleteOTP:OtpDTO):Promise<Otp | null>
}
