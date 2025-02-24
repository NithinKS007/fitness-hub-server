import { Request, Response, NextFunction } from "express";
import { authenticateAccessToken } from "../../infrastructure/services/jwtService";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { JwtPayload } from "jsonwebtoken";
import { CheckBlockStatus } from "../../domain/usecases/checkBlockStatus";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { ForbiddenError, UnauthorizedError } from "./errorMiddleWare";

const mongouserRepository = new MongoUserRepository()
const user = new CheckBlockStatus(mongouserRepository)

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    next(new UnauthorizedError(HttpStatusMessages.AuthenticationHeaderIsMissing));
    return
  }
  const accessToken = authHeader.split(' ')[1]; 
  console.log("token middle",accessToken)
  if (!accessToken) {
    next(new UnauthorizedError(HttpStatusMessages.NoAccessToken));
    return
  }
  try {
    const decoded = authenticateAccessToken(accessToken);
    req.user = decoded as JwtPayload;
    const {_id} = req.user
     const isBlocked = await user.checkBlockStatus(_id)
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
