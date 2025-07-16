import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, BlockStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_VIDEO_USECASES } from "@di/types-usecases";
import { IUpdateVideoPrivacyUC } from "@application/interfaces/usecases/IVideoUC";

@injectable()
export class UpdateVideoStatusController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.UpdateVideoPrivacyUseCase)
    private updateVideoPrivacyUseCase: IUpdateVideoPrivacyUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: videoId } = req.params;
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
