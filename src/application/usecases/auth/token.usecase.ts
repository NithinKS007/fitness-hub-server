import { ForbiddenError } from "@presentation/middlewares/error.middleware";
import { JwtStatus } from "@shared/constants/index.constants";
import { IAuthService } from "@application/interfaces/auth/IAuth.service";
import { JwtPayload } from "jsonwebtoken";

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

export class TokenUseCase {
  constructor(private authService: IAuthService) {}
  async refreshAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new ForbiddenError(JwtStatus.NoRefreshToken);
    }
    const decoded = this.authService.authenticateRefreshToken(refreshToken);
    return this.authService.generateAccessToken({
      _id: decoded._id,
      role: decoded.role,
    });
  }
  async authenticateAccessToken(accessToken: string): Promise<JwtPayload> {
    return this.authService.authenticateAccessToken(accessToken);
  }
}
