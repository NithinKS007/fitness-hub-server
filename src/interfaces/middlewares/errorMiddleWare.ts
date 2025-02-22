import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../shared/utils/customError";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";

export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (err instanceof CustomError) {
    sendResponse(res, err.statusCode, null, err.message);
  } else {
    sendResponse(res, 500, null,HttpStatusMessages.InternalServerError);
  }
};
