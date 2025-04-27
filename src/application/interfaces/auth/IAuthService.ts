import { TokenPayload } from "../../dtos/serviceDTOs/authServiceDTOs";

export interface IAuthService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  authenticateAccessToken(token: string): TokenPayload;
  authenticateRefreshToken(token: string): TokenPayload;
}
