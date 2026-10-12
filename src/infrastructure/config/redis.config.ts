import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV?.toUpperCase() === "PRODUCTION";
const redisUrl = process.env.REDIS_URL;

/** Shared Redis client used by horizontally scaled infrastructure components. */
export const redisClient = new Redis(redisUrl ?? "redis://127.0.0.1:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  keyPrefix: process.env.REDIS_KEY_PREFIX ?? "fitnesshub:",
});

let redisEnabled = Boolean(redisUrl);

redisClient.on("error", (error: Error) => {
  console.error("Redis connection error", error);
});

/**
 * Connects to Redis before the HTTP server accepts traffic.
 * Redis is mandatory in production because rate limiting is distributed.
 */
export const connectRedis = async (): Promise<void> => {
  if (!redisEnabled) {
    if (isProduction) {
      throw new Error("REDIS_URL is required in production");
    }
    return;
  }

  if (redisClient.status === "wait") {
    await redisClient.connect();
  }
};

/** Returns whether this process has Redis configured and available for use. */
export const isRedisEnabled = (): boolean => {
  return redisEnabled && redisClient.status === "ready";
};

/** Returns whether Redis is required for this deployment. */
export const isRedisRequired = (): boolean => {
  return isProduction;
};

/**
 * Closes the shared Redis connection during graceful shutdown.
 */
export const disconnectRedis = async (): Promise<void> => {
  if (redisEnabled && redisClient.status !== "end" && redisClient.status !== "wait") {
    await redisClient.quit();
  }
  redisEnabled = false;
};
