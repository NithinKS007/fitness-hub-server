import { Model } from "mongoose";
import { OtpDTO } from "@application/dtos/auth-dtos";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { Otp } from "@domain/entities/otp.entity";
import OtpModel, { IOtp } from "../models/otp.model";

export class OtpRepository
  extends BaseRepository<IOtp,Otp>
  implements IOtpRepository
{
  constructor(model: Model<IOtp> = OtpModel) {
    super(model, "_id email otp createdAt updatedAt");
  }
  public create = async ({ email, otp }: OtpDTO): Promise<Otp> => {
    const otpData = await this.model.findOneAndUpdate(
      { email },
      { otp },
      {
        new: true,
        upsert: true,
      }
    ).select("_id email otp createdAt updatedAt");
    return this.toDomain(otpData);
  };
}
