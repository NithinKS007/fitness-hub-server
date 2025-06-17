import { Model } from "mongoose";
import { OtpDTO } from "@application/dtos/auth-dtos";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IOtp } from "@domain/entities/otp.entity";
import OtpModel from "../models/otp.model";

export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository
{
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
