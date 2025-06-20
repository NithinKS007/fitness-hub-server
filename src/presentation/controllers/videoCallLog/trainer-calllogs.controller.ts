import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  StatusCodes,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetTrainerVideoCallLogUseCase } from "@application/usecases/videoCallLog/get-trainer-video-calllog.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_VIDEO_CALL_LOG_USECASES } from "di/types-usecases";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";

@injectable()
export class GetTrainerVideoCallLogController {
  constructor(
    @inject(TYPES_VIDEO_CALL_LOG_USECASES.GetTrainerVideoCallLogUseCase)
    private getTrainerVideoCallLogUseCase: GetTrainerVideoCallLogUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { trainerVideoCallLogList, paginationData } =
      await this.getTrainerVideoCallLogUseCase.execute(trainerId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { trainerVideoCallLogList, paginationData },
      VideoCallStatus.RetrievedSuccess
    );
  }
}
