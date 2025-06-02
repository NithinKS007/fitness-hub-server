import { ForbiddenError } from "../../../presentation/middlewares/error.middleware";
import { JwtStatus } from "../../../shared/constants/index.constants";
import { IAuthService } from "../../interfaces/auth/IAuth.service";
import { JwtPayload } from "jsonwebtoken";

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
