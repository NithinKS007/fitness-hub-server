import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
} from "@application/dtos/auth-dtos";
import { PasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IPasswordResetToken } from "@infrastructure/databases/models/password.token.model";

export interface IPasswordResetRepository
  extends IBaseRepository<IPasswordResetToken, PasswordResetToken> {
  create(createTokenData: CreatePassResetTokenDTO): Promise<PasswordResetToken>;
  deleteToken(
    deleteTokenData: DeletePasswordResetTokenDTO
  ): Promise<PasswordResetToken | null>;
}
