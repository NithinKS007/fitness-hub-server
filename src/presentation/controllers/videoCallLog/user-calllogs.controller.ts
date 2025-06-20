import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  StatusCodes,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetUserVideoCallLogUseCase } from "@application/usecases/videoCallLog/get-user-video-calllog.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_VIDEO_CALL_LOG_USECASES } from "di/types-usecases";

@injectable()
export class GetUserVideoCallLogController {
  constructor(
    @inject(TYPES_VIDEO_CALL_LOG_USECASES.GetUserVideoCallLogUseCase)
    private getuserVideoCallLogUseCase: GetUserVideoCallLogUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { userVideoCallLogList, paginationData } =
      await this.getuserVideoCallLogUseCase.execute(userId, queryParams);

    sendResponse(
      res,
      StatusCodes.OK,
      { userVideoCallLogList, paginationData },
      AppointmentStatus.VideoCallLogsRetrievedSuccessfully
    );
  }
}
