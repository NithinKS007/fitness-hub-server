import { Request, Response, NextFunction } from "express";
import { AuthStatus, JwtStatus } from "../../shared/constants/index.constants";
import { JwtPayload } from "jsonwebtoken";
import { CheckUserBlockStatusUseCase } from "../../application/usecases/auth/check-user-blockstatus.usecase";
import { UserRepository } from "../../infrastructure/databases/repositories/user.repository";
import { ForbiddenError, UnauthorizedError } from "./error.middleware";
import { TrainerRepository } from "../../infrastructure/databases/repositories/trainer.repository";
import { TokenUseCase } from "../../application/usecases/auth/token.usecase";
import { JwtService } from "../../infrastructure/services/auth/jwt.service";

const userRepository = new UserRepository();
const trainerRepository = new TrainerRepository();
const jwtService = new JwtService();
const checkBlockStatusUseCase = new CheckUserBlockStatusUseCase(
  userRepository,
  trainerRepository
);
const tokenUseCase = new TokenUseCase(jwtService);

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    next(new UnauthorizedError(JwtStatus.AuthenticationHeaderIsMissing));
    return;
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    next(new UnauthorizedError(JwtStatus.NoAccessToken));
    return;
  }
  try {
    const decoded = await tokenUseCase.authenticateAccessToken(accessToken);
    req.user = decoded as JwtPayload;
    const { _id } = req?.user;
    const isBlocked = await checkBlockStatusUseCase.execute(_id);
    if (isBlocked) {
      next(new ForbiddenError(AuthStatus.AccountBlocked));
      return;
    }
    next();
  } catch (error: any) {
    console.log(`Error in authentication middleware${error} `);
    next(new UnauthorizedError(JwtStatus.NoAccessToken));
    return;
  }
};
