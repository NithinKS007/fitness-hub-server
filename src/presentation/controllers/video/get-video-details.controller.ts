import { Request, Response } from "express";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetVideoDetailsUseCase } from "@application/usecases/video/get-video-details";

export class GetVideoDetailsController {
  constructor(private getVideoDetailsUseCase: GetVideoDetailsUseCase) {}

  async handleGetVideoById(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;

    const videoData = await this.getVideoDetailsUseCase.execute(videoId);

    sendResponse(res, StatusCodes.OK, videoData, VideoStatus.FetchSuccess);
  }
  
}
