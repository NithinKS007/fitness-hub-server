import { OtpRepository } from "../../interfaces/otpRepository";
import { Otp } from "../../entities/otpEntity";
import { OtpDTO } from "../../../application/dtos";

export class OtpUseCase {
  constructor(private otpRepository: OtpRepository) {}
  
  public async createOtp(data: OtpDTO): Promise<Otp> {
    return await this.otpRepository.createOtp(data);
  }
  public async findOtpByEmail(data: OtpDTO): Promise<Otp | null> {
    return await this.otpRepository.findOtpByEmail(data);
  }
}
