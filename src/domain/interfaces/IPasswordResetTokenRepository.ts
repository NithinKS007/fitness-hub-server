import {
  CreatePassResetTokenDTO,
  DeletePasswordResetTokenDTO,
  PasswordResetDTO,
} from "../../application/dtos/auth-dtos";
import { PassResetTokenEntity } from "../entities/passResetToken";

export interface IPasswordResetRepository {
  createToken(
    createTokenData: CreatePassResetTokenDTO
  ): Promise<PassResetTokenEntity>;
  verifyToken(
    verifyTokenData: PasswordResetDTO
  ): Promise<PassResetTokenEntity | null>;
  deleteToken(
    deleteTokenData: DeletePasswordResetTokenDTO
  ): Promise<PassResetTokenEntity | null>;
}
