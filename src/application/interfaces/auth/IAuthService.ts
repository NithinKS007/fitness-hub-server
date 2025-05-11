import { TokenPayload } from "../../dtos/service/authService";

export interface IAuthService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  authenticateAccessToken(token: string): TokenPayload;
  authenticateRefreshToken(token: string): TokenPayload;
}
