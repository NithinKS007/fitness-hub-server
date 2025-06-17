import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import {
  StatusCodes,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";

const handleRateLimitExceeded = (req: Request, res: Response) => {
  sendResponse(res, StatusCodes.RateLimit, null, ApplicationStatus.LimitExceed);
};

const createRateLimiter = (windowMs: number, maxRequests: number) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    message: ApplicationStatus.LimitExceed,
    statusCode: StatusCodes.RateLimit,
    handler: handleRateLimitExceeded,
  });

const rateLimiter = createRateLimiter(1 * 60 * 1000, 150);

export default rateLimiter;
