import { Model } from "mongoose";
import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
} from "@application/dtos/auth-dtos";
import { IPasswordResetRepository } from "@domain/interfaces/IPasswordResetTokenRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { PasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import PasswordResetTokenModel, {
  IPasswordResetToken,
} from "../models/password.token.model";

export class PasswordResetRepository
  extends BaseRepository<IPasswordResetToken, PasswordResetToken>
  implements IPasswordResetRepository
{
  constructor(model: Model<IPasswordResetToken> = PasswordResetTokenModel) {
    super(model);
  }
  async create({
    email,
    resetToken,
  }: CreatePassResetTokenDTO): Promise<PasswordResetToken> {
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
    return this.toDomain(PasswordResetTokenData);
  }

  async deleteToken({
    resetToken,
  }: DeletePasswordResetTokenDTO): Promise<PasswordResetToken | null> {
    const result = await PasswordResetTokenModel.findOneAndDelete({
      resetToken,
    }).exec()

    return result ? this.toDomain(result) : null;
  }
}
