import { Request, Response, NextFunction } from "express";
import { authenticateAccessToken } from "../../infrastructure/services/jwtService";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { JwtPayload } from "jsonwebtoken";
import { CheckBlockStatus } from "../../domain/usecases/checkBlockStatus";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";

const mongouserRepository = new MongoUserRepository()
const user = new CheckBlockStatus(mongouserRepository)

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    sendResponse(res, HttpStatusCodes.Unauthorized, null, "authentication header is missing");
    return;
  }
  const accessToken = authHeader.split(' ')[1]; 
  console.log("token middle",accessToken)
  if (!accessToken) {
    sendResponse(res, HttpStatusCodes.Unauthorized, null, HttpStatusMessages.NoAccessToken);
    return;
  }
  try {
    const decoded = authenticateAccessToken(accessToken);
    req.user = decoded as JwtPayload;

    const {_id} = req.user
     const isBlocked = await user.checkBlockStatus(_id)
     if (isBlocked) {
      sendResponse(res, HttpStatusCodes.Forbidden, null, HttpStatusMessages.AccountBlocked);
      return
    }

    next();
  } catch (error:any) {
    console.log("Error in authentication middleware:", error);
    sendResponse(res, HttpStatusCodes.Unauthorized, null, HttpStatusMessages.NoAccessToken);
  }
};
