import { Request, Response } from "express";
import {
  HttpStatusCodes,
  AppointmentStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { GetUserVideoCallLogUseCase } from "../../../application/usecases/videoCallLog/get-user-video-calllog.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetUserVideoCallLogController {
  constructor(private getuserVideoCallLogUseCase: GetUserVideoCallLogUseCase) {}
  async handleGetUserLogs(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { userVideoCallLogList, paginationData } =
      await this.getuserVideoCallLogUseCase.execute(userId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userVideoCallLogList, paginationData },
      AppointmentStatus.VideoCallLogsRetrievedSuccessfully
    );
  }
}
