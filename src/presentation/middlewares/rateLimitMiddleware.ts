import rateLimit from "express-rate-limit";
import {
  HttpStatusCodes,
  ApplicationStatus,
} from "../../shared/constants/index-constants";
import { sendResponse } from "../../shared/utils/httpResponse";

const rateLimiter = rateLimit({
 windowMs: 1 * 60 * 1000,
  max: 150,
  message: ApplicationStatus.TooManyRequests,
  statusCode: HttpStatusCodes.RateLimit,
  handler: (req, res) => {
    sendResponse(
      res,
      HttpStatusCodes.RateLimit,
      null,
      ApplicationStatus.TooManyRequests
    );
  },
});

export default rateLimiter;
