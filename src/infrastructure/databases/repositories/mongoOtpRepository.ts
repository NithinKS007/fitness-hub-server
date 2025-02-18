import { OtpDTO } from "../../../application/dtos";
import { Otp } from "../../../domain/entities/otpEntity";
import { OtpRepository } from "../../../domain/interfaces/otpRepository";
import otpModel from "../models/otpModel";

export class MongoOtpRepository implements OtpRepository {
  public async createOtp(data: OtpDTO): Promise<Otp> {
    const { email, otp } = data;

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
  public async verifyOtpByEmail(data: OtpDTO): Promise<Otp | null> {
    const { email,otp } = data;
    return await otpModel.findOne({ email: email,otp:otp });
  }
  public async deleteOtp(data:OtpDTO):Promise<Otp | null> {
     const {email} = data
     return await otpModel.findOneAndDelete({email})
  }
}
