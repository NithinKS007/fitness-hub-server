import { OtpDTO } from "../../../application/dtos";
import { Otp } from "../../../domain/entities/otpEntity";
import { OtpRepository } from "../../../domain/interfaces/otpRepository";
import otpModel from "../models/otpModel";

export class MongoOtpRepository implements OtpRepository {
  public async createOtp(data: OtpDTO): Promise<Otp> {
    const { email, otp } = data;

    const otpData = await otpModel.create({
      email,
      otp,
    });
    return otpData.toObject();
  }
  public async findOtpByEmail(data: OtpDTO): Promise<Otp | null> {
    const { email } = data;
    return await otpModel.findOne({ email: email });
  }
}
