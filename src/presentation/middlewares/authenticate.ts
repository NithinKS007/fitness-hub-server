import { Request, Response, NextFunction } from "express";
import {
  AuthenticationStatusMessage,
  JWTStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import { JwtPayload } from "jsonwebtoken";
import { CheckUserBlockStatus } from "../../application/usecases/auth/checkUserBlockStatusUseCase";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/userRepository";
import { ForbiddenError, UnauthorizedError } from "./errorMiddleWare";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";
import { TokenUseCase } from "../../application/usecases/auth/tokenUseCase";
import { JwtService } from "../../infrastructure/services/auth/jwtService";

const mongouserRepository = new MongoUserRepository();
const mongoTrainerRepository = new MongoTrainerRepository();
const jwtService = new JwtService();
const checkBlockStatusUseCase = new CheckUserBlockStatus(
  mongouserRepository,
  mongoTrainerRepository
);
const tokenUseCase = new TokenUseCase(jwtService);

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    next(new UnauthorizedError(JWTStatusMessage.AuthenticationHeaderIsMissing));
    return;
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    next(new UnauthorizedError(JWTStatusMessage.NoAccessToken));
    return;
  }
  try {
    const decoded = await tokenUseCase.authenticateAccessToken(accessToken);
    req.user = decoded as JwtPayload;
    const { _id } = req.user;
    const isBlocked = await checkBlockStatusUseCase.checkUserBlockStatus(_id);
    if (isBlocked) {
      next(new ForbiddenError(AuthenticationStatusMessage.AccountBlocked));
      return;
    }
    next();
  } catch (error: any) {
    console.log(`Error in authentication middleware${error} `);
    next(new UnauthorizedError(JWTStatusMessage.NoAccessToken));
    return;
  }
};
