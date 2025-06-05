import { Model } from "mongoose";
import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
} from "../../../application/dtos/auth-dtos";
import { PassResetTokenEntity } from "../../../domain/entities/pass-reset-token.entities";
import { IPasswordResetRepository } from "../../../domain/interfaces/IPasswordResetTokenRepository";
import PasswordResetTokenModel, {
  IPasswordResetToken,
} from "../models/password.token.model";
import { BaseRepository } from "./base.repository";

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
  }: CreatePassResetTokenDTO): Promise<PassResetTokenEntity> {
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
  }: DeletePasswordResetTokenDTO): Promise<PassResetTokenEntity | null> {
    return await PasswordResetTokenModel.findOneAndDelete({
      resetToken,
    }).lean();
  }
}
