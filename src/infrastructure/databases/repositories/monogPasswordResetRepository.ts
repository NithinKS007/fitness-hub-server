import { PassResetTokenDTO ,PasswordResetDTO} from "../../../application/dtos";
import { PassResetTokenEntity } from "../../../domain/entities/passResetTokenEntity";
import { PasswordResetRepository } from "../../../domain/interfaces/passwordResetTokenRepository";
import PasswordResetTokenModel from "../models/passwordResetTokenModel";

export class MonogPasswordResetRepository implements PasswordResetRepository {
  public async createToken(data: PassResetTokenDTO): Promise<PassResetTokenEntity> {
    const { email,resetToken} = data;

    const PasswordResetTokenData = await PasswordResetTokenModel.findOneAndUpdate(
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
  public async verifyToken(data: PasswordResetDTO): Promise<PassResetTokenEntity | null> {
    const {resetToken } = data;
    return await PasswordResetTokenModel.findOne({resetToken:resetToken}).lean()
  }
  public async deleteToken(data:PassResetTokenDTO):Promise<PassResetTokenEntity | null> {
     const {resetToken} = data
     return await PasswordResetTokenModel.findOneAndDelete({resetToken}).lean()
  }
}
