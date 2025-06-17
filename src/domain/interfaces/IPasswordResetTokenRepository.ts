import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
} from "@application/dtos/auth-dtos";
import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IPasswordResetRepository
  extends IBaseRepository<IPasswordResetToken> {
  createToken(
    createTokenData: CreatePassResetTokenDTO
  ): Promise<IPasswordResetToken>;
  deleteToken(
    deleteTokenData: DeletePasswordResetTokenDTO
  ): Promise<IPasswordResetToken | null>;
}
