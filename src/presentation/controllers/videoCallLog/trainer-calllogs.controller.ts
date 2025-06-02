import { Request, Response } from "express";
import {
  HttpStatusCodes,
  AppointmentStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { TrainerVideoCallLogUseCase } from "../../../application/usecases/videoCallLog/trainer-videocalllog.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class TrainerVideoCallController {
  constructor(private trainerVideoCallLogUseCase: TrainerVideoCallLogUseCase) {}
  async getVideoCallLogsTrainer(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { trainerVideoCallLogList, paginationData } =
      await this.trainerVideoCallLogUseCase.getTrainerVideoCallLogs(
        trainerId,
        queryParams
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainerVideoCallLogList, paginationData },
      AppointmentStatus.VideoCallLogsRetrievedSuccessfully
    );
  }
}
