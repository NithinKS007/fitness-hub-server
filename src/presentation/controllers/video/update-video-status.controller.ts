import { Request, Response } from "express";
import {
  HttpStatusCodes,
  BlockStatus,
} from "../../../shared/constants/index.constants";
import { sendResponse } from "../../../shared/utils/http.response";
import { UpdateVideoPrivacyUseCase } from "../../../application/usecases/video/update-video.privacy.usecase";

export class UpdateVideoStatusController {
  constructor(private updateVideoPrivacyUseCase: UpdateVideoPrivacyUseCase) {}
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
      HttpStatusCodes.OK,
      videoData,
      BlockStatus.BlockStatusUpdated
    );
  }
}
