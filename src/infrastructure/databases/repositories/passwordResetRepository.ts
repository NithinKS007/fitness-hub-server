import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
  PasswordResetDTO,
} from "../../../application/dtos/auth-dtos";
import { PassResetTokenEntity } from "../../../domain/entities/passResetToken";
import { IPasswordResetRepository } from "../../../domain/interfaces/IPasswordResetTokenRepository";
import PasswordResetTokenModel from "../models/passwordResetTokenModel";

export class MonogPasswordResetRepository implements IPasswordResetRepository {
  public async createToken({
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
  public async verifyToken({
    resetToken,
  }: PasswordResetDTO): Promise<PassResetTokenEntity | null> {
    return await PasswordResetTokenModel.findOne({
      resetToken: resetToken,
    }).lean();
  }
  public async deleteToken({
    resetToken,
  }: DeletePasswordResetTokenDTO): Promise<PassResetTokenEntity | null> {
    return await PasswordResetTokenModel.findOneAndDelete({
      resetToken,
    }).lean();
  }
}
