import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import {
  HttpStatusCodes,
  ApplicationStatus,
} from "../../shared/constants/index.constants";
import { sendResponse } from "../../shared/utils/http.response";

const handleRateLimitExceeded = (req: Request, res: Response) => {
  sendResponse(
    res,
    HttpStatusCodes.RateLimit,
    null,
    ApplicationStatus.TooManyRequests
  );
};

const createRateLimiter = (windowMs: number, maxRequests: number) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    message: ApplicationStatus.TooManyRequests,
    statusCode: HttpStatusCodes.RateLimit,
    handler: handleRateLimitExceeded,
  });

const rateLimiter = createRateLimiter(1 * 60 * 1000, 150);

export default rateLimiter;
