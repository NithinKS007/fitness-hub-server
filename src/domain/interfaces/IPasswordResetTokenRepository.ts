import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
  PasswordResetDTO,
} from "../../application/dtos/auth-dtos";
import { IPasswordResetToken } from "../../infrastructure/databases/models/password.token.model";
import { PassResetTokenEntity } from "../entities/pass-reset-token.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IPasswordResetRepository
  extends IBaseRepository<IPasswordResetToken> {
  createToken(
    createTokenData: CreatePassResetTokenDTO
  ): Promise<PassResetTokenEntity>;
  deleteToken(
    deleteTokenData: DeletePasswordResetTokenDTO
  ): Promise<PassResetTokenEntity | null>;
}
