import { Request, Response } from "express";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetVideosUseCase } from "@application/usecases/video/get-video.usecase";
import { parseQueryParams } from "@shared/utils/parse.queryParams";

export class GetAllVideosController {
  constructor(private getVideosUseCase: GetVideosUseCase) {}

  async handleGetAllVideos(req: Request, res: Response): Promise<void> {
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
