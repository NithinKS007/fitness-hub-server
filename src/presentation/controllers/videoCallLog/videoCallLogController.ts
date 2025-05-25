import { Request, Response } from "express";
import {
  HttpStatusCodes,
  AppointmentStatus,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { TrainerVideoCallLogUseCase } from "../../../application/usecases/videoCallLog/trainerVideoCallLogUseCase";
import { UserVideoCallLogUseCase } from "../../../application/usecases/videoCallLog/userVideoCallLogUseCase";

export class VideoCallLogController {
  constructor(
    private trainerVideoCallLogUseCase: TrainerVideoCallLogUseCase,
    private userVideoCallLogUseCase: UserVideoCallLogUseCase
  ) {}

  public async getVideoCallLogsTrainer(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { trainerVideoCallLogList, paginationData } =
      await this.trainerVideoCallLogUseCase.getTrainerVideoCallLogs(trainerId, {
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

  public async getUserVideoCallLogs(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { userVideoCallLogList, paginationData } =
      await this.userVideoCallLogUseCase.getUserVideoCallLogs(userId, {
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
