import { NextFunction, Request, Response } from "express";
import {
  HttpStatusCodes,
  AppointmentStatus,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoVideoCallLogRepository } from "../../../infrastructure/databases/repositories/videoCallLogRepository";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { VideoCallLogUseCase } from "../../../application/usecases/videoCallLog/videoCallLogUseCase";

//MONGO REPOSITORY INSTANCES
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

//USE CASE INSTANCES
const videoCallLogUseCase = new VideoCallLogUseCase(
  mongoVideoCallLogRepository
);


export class VideoCallLogController {
  static async getVideoCallLogsTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query
      const { trainerVideoCallLogList, paginationData } =
        await videoCallLogUseCase.getTrainerVideoCallLogs(trainerId, {
          fromDate: fromDate as any,
          toDate: toDate as any,
          page: page as string,
          limit: limit as string,
          search: search as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { trainerVideoCallLogList, paginationData },
        AppointmentStatus.VideoCallLogsRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "BookingController.getVideoCallLogsTrainer",
        "Error retrieving video call logs for trainer"
      );
      next(error);
    }
  }

  static async getUserVideoCallLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { userVideoCallLogList, paginationData } =
        await videoCallLogUseCase.getUserVideoCallLogs(userId, {
          fromDate: fromDate as any,
          toDate: toDate as any,
          page: page as string,
          limit: limit as string,
          search: search as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { userVideoCallLogList, paginationData },
        AppointmentStatus.VideoCallLogsRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "BookingController.getUserVideoCallLogs",
        "Error retrieving video call logs for user"
      );
      next(error);
    }
  }
}
