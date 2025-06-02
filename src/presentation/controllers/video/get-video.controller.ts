import { Request, Response } from "express";
import {
  HttpStatusCodes,
  VideoStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { GetVideoUseCase } from "../../../application/usecases/video/get-video.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetVideoController {
  constructor(private getVideoUseCase: GetVideoUseCase) {}
  async getVideos(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const queryParams = parseQueryParams(req.query);
    const { videoList, paginationData } = await this.getVideoUseCase.getVideos(
      trainerId,
      queryParams
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { videoList: videoList, paginationData: paginationData },
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }

  async getPublicVideos(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const queryParams = parseQueryParams(req.query);
    const { videoList, paginationData } =
      await this.getVideoUseCase.getPublicVideos(trainerId, queryParams);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { videoList: videoList, paginationData: paginationData },
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }

  async getVideoById(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const videoData = await this.getVideoUseCase.getVideoById(videoId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      videoData,
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }
}
