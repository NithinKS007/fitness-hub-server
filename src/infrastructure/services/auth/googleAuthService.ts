import { OAuth2Client, TokenPayload } from "google-auth-library";
import dotenv from "dotenv";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { IGoogleAuthService } from "../../../application/interfaces/auth/IGoogleAuthService";
dotenv.config();

export class GoogleAuthService implements IGoogleAuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  public async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new validationError(AuthStatus.GoogleAuthFailed);
      }
      return payload;
    } catch (error) {
      throw new validationError(AuthStatus.GoogleAuthFailed);
    }
  }
}
