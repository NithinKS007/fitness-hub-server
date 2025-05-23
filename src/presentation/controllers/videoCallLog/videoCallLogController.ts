import { Request, Response } from "express";
import {
  HttpStatusCodes,
  AppointmentStatus,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoVideoCallLogRepository } from "../../../infrastructure/databases/repositories/videoCallLogRepository";
import { VideoCallLogUseCase } from "../../../application/usecases/videoCallLog/videoCallLogUseCase";

//MONGO REPOSITORY INSTANCES
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository();

//USE CASE INSTANCES
const videoCallLogUseCase = new VideoCallLogUseCase(
  mongoVideoCallLogRepository
);

export class VideoCallLogController {
  static async getVideoCallLogsTrainer(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
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
  }

  static async getUserVideoCallLogs(
    req: Request,
    res: Response
  ): Promise<void> {
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
  }
}
