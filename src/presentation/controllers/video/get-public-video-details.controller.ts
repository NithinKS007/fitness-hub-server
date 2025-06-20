import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { GetVideoDetailsUseCase } from "@application/usecases/video/get-video-details";
import { TYPES_VIDEO_USECASES } from "di/types-usecases";

@injectable()
export class GetPublicVideoDetailsController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.GetVideoDetailsUseCase)
    private getVideoDetailsUseCase: GetVideoDetailsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const privacy = false;
    const videoData = await this.getVideoDetailsUseCase.execute(
      videoId,
      privacy
    );
    sendResponse(res, StatusCodes.OK, videoData, VideoStatus.FetchSuccess);
  }
}
