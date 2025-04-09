import { Request, Response, NextFunction } from "express";
import { authenticateAccessToken } from "../../infrastructure/services/jwtService";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { JwtPayload } from "jsonwebtoken";
import { CheckUserBlockStatus } from "../../application/usecases/checkUserBlockStatusUseCase";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/userRepository";
import { ForbiddenError, UnauthorizedError } from "./errorMiddleWare";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";

const mongouserRepository = new MongoUserRepository()
const mongoTrainerRepository = new MongoTrainerRepository()
const checkBlockStatusUseCase = new CheckUserBlockStatus(mongouserRepository,mongoTrainerRepository)

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    next(new UnauthorizedError(HttpStatusMessages.AuthenticationHeaderIsMissing));
    return
  }
  const accessToken = authHeader.split(' ')[1]; 
  if (!accessToken) {
    next(new UnauthorizedError(HttpStatusMessages.NoAccessToken));
    return
  }
  try {
    const decoded = authenticateAccessToken(accessToken);
    req.user = decoded as JwtPayload;
    const {_id } = req.user
      const isBlocked = await checkBlockStatusUseCase.checkUserBlockStatus(_id)
      if (isBlocked) {
       next(new ForbiddenError(HttpStatusMessages.AccountBlocked));
       return
       }
    next();
  } catch (error:any) {
    console.log(`Error in authentication middleware${error} `);
   next(new UnauthorizedError(HttpStatusMessages.NoAccessToken));
   return
  }
};
