import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes, VideoStatus } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_VIDEO_USECASES } from "@di/types-usecases";
import { IGetVideoDetailsUC } from "@application/interfaces/usecases/IVideoUC";

@injectable()
export class GetPublicVideoDetailsController {
  constructor(
    @inject(TYPES_VIDEO_USECASES.GetVideoDetailsUseCase)
    private getVideoDetailsUseCase: IGetVideoDetailsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { trainerId, videoId } = req.params;

    const privacy = false;
    const videoData = await this.getVideoDetailsUseCase.execute({
      trainerId,
      videoId,
      privacy,
    });

    sendResponse(res, StatusCodes.OK, videoData, VideoStatus.FetchSuccess);
  }
}
