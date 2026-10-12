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
    super(
      model,
      "_id email resetToken resetTokenCreatedAt createdAt updatedAt"
    );
  }
  public create = async ({
    email,
    resetToken,
  }: CreatePassResetTokenDTO): Promise<PasswordResetToken> => {
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
      ).select("_id email resetToken resetTokenCreatedAt createdAt updatedAt");
    return this.toDomain(PasswordResetTokenData);
  };

  public deleteToken = async ({
    resetToken,
  }: DeletePasswordResetTokenDTO): Promise<PasswordResetToken | null> => {
    const result = await PasswordResetTokenModel.findOneAndDelete({
      resetToken,
    })
      .select("_id email resetToken resetTokenCreatedAt createdAt updatedAt")
      .exec();

    return result ? this.toDomain(result) : null;
  };
}
