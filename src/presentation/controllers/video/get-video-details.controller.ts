import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetVideoDetailsUseCase } from "@application/usecases/video/get-video-details";
import { TYPES_VIDEO_USECASES } from "di/types-usecases";

@injectable()
export class GetVideoDetailsController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.GetVideoDetailsUseCase)
    private getVideoDetailsUseCase: GetVideoDetailsUseCase
  ) {}

  async handleGetVideoById(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;

    const videoData = await this.getVideoDetailsUseCase.execute(videoId);

    sendResponse(res, StatusCodes.OK, videoData, VideoStatus.FetchSuccess);
  }
}
