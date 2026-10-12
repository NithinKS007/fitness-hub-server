import { Request, Response } from "express";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import {
  StatusCodes,
  ApplicationStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import {
  isRedisEnabled,
  isRedisRequired,
  redisClient,
} from "@infrastructure/config/redis.config";

interface RateLimiterOptions {
  keyPrefix: string;
  points: number;
  durationSeconds: number;
  blockDurationSeconds?: number;
}

/**
 * Creates a Redis-backed limiter. It deliberately fails open in development
 * when Redis is not configured, while production startup requires Redis.
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: options.keyPrefix,
    points: options.points,
    duration: options.durationSeconds,
    blockDuration: options.blockDurationSeconds,
  });

  return async (req: Request, res: Response, next: () => void) => {
    if (!isRedisEnabled()) {
      if (isRedisRequired()) {
        sendResponse(
          res,
          StatusCodes.InternalServerError,
          null,
          "Rate limiting is temporarily unavailable"
        );
        return;
      }
      next();
      return;
    }

    try {
      await limiter.consume(req.ip ?? "unknown");
      next();
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil(error.msBeforeNext / 1000)
        );
        res.setHeader("Retry-After", retryAfterSeconds.toString());
        sendResponse(
          res,
          StatusCodes.RateLimit,
          null,
          ApplicationStatus.LimitExceed
        );
        return;
      }

      if (isRedisRequired()) {
        sendResponse(
          res,
          StatusCodes.InternalServerError,
          null,
          "Rate limiting is temporarily unavailable"
        );
        return;
      }
      next();
    }
  };
};

const rateLimiter = createRateLimiter({
  keyPrefix: "rate-limit:api",
  points: 150,
  durationSeconds: 60,
});

export const authRateLimiter = createRateLimiter({
  keyPrefix: "rate-limit:auth",
  points: 30,
  durationSeconds: 15 * 60,
  blockDurationSeconds: 15 * 60,
});

export const paymentRateLimiter = createRateLimiter({
  keyPrefix: "rate-limit:payment",
  points: 20,
  durationSeconds: 60,
});

export default rateLimiter;
