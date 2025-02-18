import { OtpDTO } from "../../application/dtos";
import { Otp } from "../entities/otpEntity";

export interface OtpRepository {
  createOtp(data: OtpDTO): Promise<Otp>;
  verifyOtpByEmail(data: OtpDTO): Promise<Otp | null>;
  deleteOtp(data:OtpDTO):Promise<Otp | null>
}
