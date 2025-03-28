import { PassResetTokenDTO,PasswordResetDTO } from "../../application/dtos/authDTOs";
import { PassResetTokenEntity } from "../entities/passResetTokenEntity";

export interface PasswordResetRepository {
  createToken(data: PassResetTokenDTO): Promise<PassResetTokenEntity>;
  verifyToken(data: PasswordResetDTO): Promise<PassResetTokenEntity | null>;
  deleteToken(data: PassResetTokenDTO): Promise<PassResetTokenEntity | null>;
}
