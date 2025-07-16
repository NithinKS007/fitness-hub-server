import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {
  StatusCodes,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_VIDEO_CALL_LOG_USECASES } from "@di/types-usecases";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";
import { IGetUserVideoCallLogUC } from "@application/interfaces/usecases/IVideoCallLogUC";

@injectable()
export class GetUserVideoCallLogController {
  constructor(
    @inject(TYPES_VIDEO_CALL_LOG_USECASES.GetUserVideoCallLogUseCase)
    private getuserVideoCallLogUseCase: IGetUserVideoCallLogUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { userVideoCallLogList, paginationData } =
      await this.getuserVideoCallLogUseCase.execute({userId,...queryParams});

    sendResponse(
      res,
      StatusCodes.OK,
      { userVideoCallLogList, paginationData },
      VideoCallStatus.RetrievedSuccess
    );
  }
}
