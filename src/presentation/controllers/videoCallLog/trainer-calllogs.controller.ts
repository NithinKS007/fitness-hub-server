import { Request, Response } from "express";
import {
  StatusCodes,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetTrainerVideoCallLogUseCase } from "@application/usecases/videoCallLog/get-trainer-video-calllog.usecase";
import { parseQueryParams } from "@shared/utils/parse.queryParams";

export class GetTrainerVideoCallLogController {
  constructor(
    private getTrainerVideoCallLogUseCase: GetTrainerVideoCallLogUseCase
  ) {}

  async handleGetTrainerLogs(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { trainerVideoCallLogList, paginationData } =
      await this.getTrainerVideoCallLogUseCase.execute(trainerId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { trainerVideoCallLogList, paginationData },
      AppointmentStatus.VideoCallLogsRetrievedSuccessfully
    );
  }
}
