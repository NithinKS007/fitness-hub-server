import { TokenPayload } from "@application/dtos/service/auth.service";

export interface IAuthService {
  createAccessToken(payload: TokenPayload): string;
  createRefreshToken(payload: TokenPayload): string;
  authAccessToken(token: string): TokenPayload;
  authRefreshToken(token: string): TokenPayload;
}
