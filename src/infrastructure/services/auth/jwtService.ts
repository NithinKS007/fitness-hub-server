import jwt from "jsonwebtoken";
import ms from "ms";
import { EnvironmentVariableStatusMessage } from "../../../shared/constants/httpResponseStructure";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import dotenv from "dotenv";
import { IAuthService } from "../../../application/interfaces/auth/IAuthService";
import { TokenPayload } from "../../../application/dtos/serviceDTOs/authServiceDTOs";
dotenv.config();

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
      throw new validationError(EnvironmentVariableStatusMessage.MissingJwtEnvironmentVariables);
    }
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration as ms.StringValue,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpiration as ms.StringValue,
    });
  }

  authenticateAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.jwtSecret) as TokenPayload;
  }

  authenticateRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.jwtRefreshSecret) as TokenPayload;
  }
}

