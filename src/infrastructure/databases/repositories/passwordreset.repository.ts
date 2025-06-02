import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
  PasswordResetDTO,
} from "../../../application/dtos/auth-dtos";
import { PassResetTokenEntity } from "../../../domain/entities/pass-reset-token.entities";
import { IPasswordResetRepository } from "../../../domain/interfaces/IPasswordResetTokenRepository";
import PasswordResetTokenModel from "../models/password.token.model";

export class PasswordResetRepository implements IPasswordResetRepository {
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
  async verifyToken({
    resetToken,
  }: PasswordResetDTO): Promise<PassResetTokenEntity | null> {
    return await PasswordResetTokenModel.findOne({
      resetToken: resetToken,
    }).lean();
  }
  async deleteToken({
    resetToken,
  }: DeletePasswordResetTokenDTO): Promise<PassResetTokenEntity | null> {
    return await PasswordResetTokenModel.findOneAndDelete({
      resetToken,
    }).lean();
  }
}
