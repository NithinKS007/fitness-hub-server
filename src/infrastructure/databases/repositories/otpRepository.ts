import { OtpDTO } from "../../../application/dtos/authDTOs";
import { Otp } from "../../../domain/entities/otpEntity";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import otpModel from "../models/otpModel";

export class MongoOtpRepository implements IOtpRepository {
  public async createOtp({ email, otp }: OtpDTO): Promise<Otp> {
    const otpData = await otpModel.findOneAndUpdate(
      { email },
      { otp },
      {
        new: true,
        upsert: true,
      }
    );
    return otpData.toObject();
  }
  public async verifyOtpByEmail({ email, otp }: OtpDTO): Promise<Otp | null> {
    return await otpModel.findOne({ email: email, otp: otp }).lean();
  }
  public async deleteOtp({ email }: OtpDTO): Promise<Otp | null> {
    return await otpModel.findOneAndDelete({ email }).lean();
  }
}
