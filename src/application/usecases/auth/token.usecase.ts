import { ForbiddenError } from "@presentation/middlewares/error.middleware";
import { JwtStatus } from "@shared/constants/index.constants";
import { IAuthService } from "@application/interfaces/services/auth/IAuth.service";
import { JwtPayload } from "jsonwebtoken";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { ITokenUC } from "@application/interfaces/usecases/IAuthUC";

/**
 * refreshAccessToken:
 * Purpose: Refresh the access token using the provided refresh token.
 * Incoming: { refreshToken } - The refresh token used to generate a new access token.
 * Returns: String - A new access token.
 * Throws: ForbiddenError if the refresh token is not provided or invalid.
 */

/**
 * authenticateAccesstoken :
 * Purpose: Authenticate and decode the provided access token.
 * Incoming: { accessToken } - The access token to authenticate and decode.
 * Returns: JwtPayload - The decoded payload from the access token.
 */

@injectable()
export class TokenUseCase implements ITokenUC {
  constructor(
    @inject(TYPES_SERVICES.AuthService)
    private authService: IAuthService
  ) {}

  async refreshToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new ForbiddenError(JwtStatus.NoRefreshToken);
    }
    const decoded = this.authService.authRefreshToken(refreshToken);
    return this.authService.createAccessToken({
      _id: decoded._id,
      role: decoded.role,
    });
  }
  async validateToken(accessToken: string): Promise<JwtPayload> {
    return this.authService.authAccessToken(accessToken);
  }
}
