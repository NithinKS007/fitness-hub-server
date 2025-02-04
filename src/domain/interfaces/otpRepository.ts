import { OtpDTO } from "../../application/dtos";
import { Otp } from "../entities/otpEntity";

export interface OtpRepository {
  createOtp(data: OtpDTO): Promise<Otp>;
  findOtpByEmail(data: OtpDTO): Promise<Otp | null>;
}
