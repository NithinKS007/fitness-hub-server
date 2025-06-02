import { TokenPayload } from "google-auth-library";

export interface IGoogleAuthService {
  verifyToken(token: string): Promise<TokenPayload>;
}
