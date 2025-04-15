import { CreatePassResetTokenDTO,DeletePasswordResetTokenDTO,PasswordResetDTO } from "../../application/dtos/authDTOs";
import { PassResetTokenEntity } from "../entities/passResetTokenEntity";

export interface IPasswordResetRepository {
  createToken(createTokenData: CreatePassResetTokenDTO): Promise<PassResetTokenEntity>;
  verifyToken(verifyTokenData: PasswordResetDTO): Promise<PassResetTokenEntity | null>;
  deleteToken(deleteTokenData: DeletePasswordResetTokenDTO): Promise<PassResetTokenEntity | null>;
}
