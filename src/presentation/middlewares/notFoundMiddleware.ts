import {
  HttpStatusCodes,
  ApplicationStatus,
} from "../../shared/constants/index-constants";
import { sendResponse } from "../../shared/utils/httpResponse";
import { Request, Response } from "express";
export const notFoundMiddleware = (req: Request, res: Response): void => {
  sendResponse(
    res,
    HttpStatusCodes.NotFound,
    null,
    ApplicationStatus.ResourceNotFound
  );
};
 