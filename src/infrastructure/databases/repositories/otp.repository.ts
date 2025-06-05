import { Model } from "mongoose";
import { OtpDTO } from "../../../application/dtos/auth-dtos";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import OtpModel, { IOtp } from "../models/otp.model";
import { BaseRepository } from "./base.repository";

export class OtpRepository  extends BaseRepository<IOtp> implements IOtpRepository {
   constructor(model: Model<IOtp> = OtpModel) {
      super(model);
    }
  async create({ email, otp }: OtpDTO): Promise<IOtp> {
    const otpData = await this.model.findOneAndUpdate(
      { email },
      { otp },
      {
        new: true,
        upsert: true,
      }
    );
    return otpData.toObject();
  }
}
