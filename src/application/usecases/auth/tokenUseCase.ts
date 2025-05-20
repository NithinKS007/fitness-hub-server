import { ForbiddenError } from "../../../presentation/middlewares/errorMiddleWare";
import { JwtStatus } from "../../../shared/constants/index-constants";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import { JwtPayload } from "jsonwebtoken";

export class TokenUseCase {
  constructor(private authService: IAuthService) {}
  public async refreshAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new ForbiddenError(JwtStatus.NoRefreshToken);
    }
    const decoded = this.authService.authenticateRefreshToken(refreshToken);
    return this.authService.generateAccessToken({
      _id: decoded._id,
      role: decoded.role,
    });
  }
  public async authenticateAccessToken(
    accessToken: string
  ): Promise<JwtPayload> {
    return this.authService.authenticateAccessToken(accessToken);
  }
}
