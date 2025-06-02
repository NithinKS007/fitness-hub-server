import crypto from "crypto";
import { ITokenService } from "../../../application/interfaces/security/IToken.service";

export class TokenService implements ITokenService {
  async generateToken(): Promise<string> {
    return crypto.randomBytes(32).toString("hex");
  }

  async hashToken(token: string): Promise<string> {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
