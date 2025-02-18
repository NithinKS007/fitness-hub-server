import { Request, Response, NextFunction } from "express";
import { authenticateAccessToken } from "../../infrastructure/services/jwtService";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { JwtPayload } from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];

  console.log("token middle",accessToken)
  if (!accessToken) {
    sendResponse(res, HttpStatusCodes.Forbidden, null, HttpStatusMessages.NoAccessToken);
    return;
  }
  try {
    const decoded = authenticateAccessToken(accessToken);
    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    console.log("Error in authentication middleware:", error);
    sendResponse(res, HttpStatusCodes.Unauthorized, null, HttpStatusMessages.NoAccessToken);
  }
};
