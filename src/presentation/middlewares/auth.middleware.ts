import { Request, Response, NextFunction } from "express";
import { AuthStatus, JwtStatus } from "@shared/constants/index.constants";
import { JwtPayload } from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "./error.middleware";
import { checkBlockStatusUseCase, tokenUseCase } from "di/container-resolver";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    next(new UnauthorizedError(JwtStatus.AuthHeaderMissing));
    return;
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    next(new UnauthorizedError(JwtStatus.NoAccessToken));
    return;
  }
  try {
    const decoded = await tokenUseCase.authAccessToken(accessToken);
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
