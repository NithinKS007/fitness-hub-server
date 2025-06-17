import { Model } from "mongoose";
import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
} from "@application/dtos/auth-dtos";
import { IPasswordResetRepository } from "@domain/interfaces/IPasswordResetTokenRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import PasswordResetTokenModel from "../models/password.token.model";

export class PasswordResetRepository
  extends BaseRepository<IPasswordResetToken>
  implements IPasswordResetRepository
{
  constructor(model: Model<IPasswordResetToken> = PasswordResetTokenModel) {
    super(model);
  }
  async createToken({
    email,
    resetToken,
  }: CreatePassResetTokenDTO): Promise<IPasswordResetToken> {
    const PasswordResetTokenData =
      await PasswordResetTokenModel.findOneAndUpdate(
        { email },
        {
          resetToken,
          resetTokenCreatedAt: Date.now(),
        },
        {
          new: true,
          upsert: true,
        }
      );
    return PasswordResetTokenData.toObject();
  }

  async deleteToken({
    resetToken,
  }: DeletePasswordResetTokenDTO): Promise<IPasswordResetToken | null> {
    return await PasswordResetTokenModel.findOneAndDelete({
      resetToken,
    }).lean();
  }
}
