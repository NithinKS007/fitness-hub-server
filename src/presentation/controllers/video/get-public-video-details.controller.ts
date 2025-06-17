import { Request, Response } from "express";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetVideoDetailsUseCase } from "@application/usecases/video/get-video-details";

export class GetPublicVideoDetailsController {
  constructor(private getVideoDetailsUseCase: GetVideoDetailsUseCase) {}

  async handleGetPublicVideoById(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const privacy = false;
    const videoData = await this.getVideoDetailsUseCase.execute(
      videoId,
      privacy
    );
    sendResponse(res, StatusCodes.OK, videoData, VideoStatus.FetchSuccess);
  }
}
