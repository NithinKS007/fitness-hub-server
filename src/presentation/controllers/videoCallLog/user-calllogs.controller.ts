import { Request, Response } from "express";
import {
  HttpStatusCodes,
  AppointmentStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { UserVideoCallLogUseCase } from "../../../application/usecases/videoCallLog/user-videocalllog.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class UserVideoCallController {
  constructor(private userVideoCallLogUseCase: UserVideoCallLogUseCase) {}
  async getUserVideoCallLogs(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { userVideoCallLogList, paginationData } =
      await this.userVideoCallLogUseCase.getUserVideoCallLogs(
        userId,
        queryParams
      );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userVideoCallLogList, paginationData },
      AppointmentStatus.VideoCallLogsRetrievedSuccessfully
    );
  }
}
