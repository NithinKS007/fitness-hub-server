import jwt from "jsonwebtoken";
import ms from "ms";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import dotenv from "dotenv";
import { IAuthService } from "@application/interfaces/services/auth/IAuth.service";
import { TokenPayload } from "@application/dtos/service/auth.service";
import { injectable } from "inversify";
dotenv.config();

@injectable()
export class JwtService implements IAuthService {
  private readonly jwtSecret = process.env.JWT_SECRET!;
  private readonly jwtExpiration = process.env.JWT_EXPIRATION!;
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
  private readonly jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION!;

  constructor() {
    this.validateEnv();
  }

  private validateEnv(): void {
    if (
      !this.jwtSecret ||
      !this.jwtExpiration ||
      !this.jwtRefreshSecret ||
      !this.jwtRefreshExpiration
    ) {
      throw new validationError(
        ApplicationStatus.MissingJwtEnvironmentVariables
      );
    }
  }

  createAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration as ms.StringValue,
    });
  }

  createRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpiration as ms.StringValue,
    });
  }

  authAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.jwtSecret) as TokenPayload;
  }

  authRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.jwtRefreshSecret) as TokenPayload;
  }
}
