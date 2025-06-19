import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, BlockStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { UpdateVideoPrivacyUseCase } from "@application/usecases/video/update-video.privacy.usecase";
import { TYPES_VIDEO_USECASES } from "di/types-usecases";

@injectable()
export class UpdateVideoStatusController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.UpdateVideoPrivacyUseCase)
    private updateVideoPrivacyUseCase: UpdateVideoPrivacyUseCase
  ) {}

  async handleUpdatePrivacy(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const { privacy } = req.body;

    const updatedVideoData = {
      videoId,
      privacy,
    };

    const videoData = await this.updateVideoPrivacyUseCase.execute(
      updatedVideoData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      videoData,
      BlockStatus.StatusUpdateFailed
    );
  }
}
