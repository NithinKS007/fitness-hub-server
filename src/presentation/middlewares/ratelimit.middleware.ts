import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import {
  StatusCodes,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";

export const createRateLimiter = (windowMs: number, maxRequests: number) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    message: ApplicationStatus.LimitExceed,
    statusCode: StatusCodes.RateLimit,
    handler: (req: Request, res: Response) => {
      sendResponse(
        res,
        StatusCodes.RateLimit,
        null,
        ApplicationStatus.LimitExceed
      );
    },
  });

const rateLimiter = createRateLimiter(1 * 60 * 1000, 150);

// These endpoints are cheap to call but expensive to abuse. The default
// memory store is safe for a single process; use a shared store when scaling
// horizontally (see README deployment notes).
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 30);
export const paymentRateLimiter = createRateLimiter(60 * 1000, 20);

export default rateLimiter;
