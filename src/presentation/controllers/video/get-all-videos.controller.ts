import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetVideosUseCase } from "@application/usecases/video/get-video.usecase";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_VIDEO_USECASES } from "@di/types-usecases";

@injectable()
export class GetAllVideosController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.GetVideosUseCase)
    private getVideosUseCase: GetVideosUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const queryParams = parseQueryParams(req.query);

    const { videoList, paginationData } = await this.getVideosUseCase.execute(
      trainerId,
      queryParams
    );

    sendResponse(
      res,
      StatusCodes.OK,
      { videoList: videoList, paginationData: paginationData },
      VideoStatus.FetchSuccess
    );
  }
}
